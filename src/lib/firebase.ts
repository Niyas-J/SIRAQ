import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Student } from './studentTypes';
import { sampleStudents } from './sampleStudents';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoConfigKeyForBuildPass12345',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'siraq-verify.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'siraq-verify',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'siraq-verify.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789012:web:demo1234567890',
};

// Check if Firebase keys are real
const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('DemoConfigKey')
);

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (typeof window !== 'undefined' || isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
  }
}

// In-Memory Storage for fallback when Firebase credentials are pending
let localMemoryStudents: Student[] = [...sampleStudents];

// Firestore CRUD & Service Layer
export const studentService = {
  // Get student by student ID
  async getStudentById(studentId: string): Promise<Student | null> {
    const formattedId = studentId.trim().toUpperCase();
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'students'), where('studentId', '==', formattedId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          return { id: docSnap.id, ...docSnap.data() } as Student;
        }
      } catch (err) {
        console.error('Firestore fetch error:', err);
      }
    }
    // Fallback to local memory / sample data
    const found = localMemoryStudents.find((s) => s.studentId.toUpperCase() === formattedId);
    return found || null;
  },

  // Increment scan count and lastScannedAt timestamp
  async recordScan(studentId: string): Promise<void> {
    const formattedId = studentId.trim().toUpperCase();
    const nowISO = new Date().toISOString();

    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'students'), where('studentId', '==', formattedId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, {
            scanCount: increment(1),
            lastScannedAt: nowISO,
          });
          return;
        }
      } catch (err) {
        console.error('Error recording scan in Firestore:', err);
      }
    }

    const idx = localMemoryStudents.findIndex((s) => s.studentId.toUpperCase() === formattedId);
    if (idx !== -1) {
      localMemoryStudents[idx] = {
        ...localMemoryStudents[idx],
        scanCount: (localMemoryStudents[idx].scanCount || 0) + 1,
        lastScannedAt: nowISO,
      };
    }
  },

  // Get all students for admin panel
  async getAllStudents(): Promise<Student[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snapshot = await getDocs(collection(db, 'students'));
        const list: Student[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Student);
        });
        if (list.length > 0) {
          return list;
        }
      } catch (err) {
        console.error('Firestore get all students error:', err);
      }
    }
    return [...localMemoryStudents];
  },

  // Save/Create student
  async saveStudent(studentData: Omit<Student, 'id'>, docId?: string): Promise<Student> {
    const now = new Date().toISOString();
    const formattedId = studentData.studentId.trim().toUpperCase();

    const newStudent: Student = {
      ...studentData,
      studentId: formattedId,
      createdAt: studentData.createdAt || now,
      updatedAt: now,
      scanCount: studentData.scanCount || 0,
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(collection(db, 'students'), docId || formattedId);
        await setDoc(docRef, newStudent, { merge: true });
        return { id: docRef.id, ...newStudent };
      } catch (err) {
        console.error('Firestore save student error:', err);
      }
    }

    const existingIndex = localMemoryStudents.findIndex((s) => s.studentId.toUpperCase() === formattedId);
    if (existingIndex !== -1) {
      localMemoryStudents[existingIndex] = { ...newStudent, id: formattedId };
    } else {
      localMemoryStudents.unshift({ ...newStudent, id: formattedId });
    }
    return { id: formattedId, ...newStudent };
  },

  // Delete student
  async deleteStudent(studentId: string, photoUrl?: string): Promise<boolean> {
    const formattedId = studentId.trim().toUpperCase();

    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'students'), where('studentId', '==', formattedId));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          await deleteDoc(snapshot.docs[0].ref);
        }

        if (photoUrl && storage && photoUrl.includes('firebasestorage')) {
          try {
            const photoRef = ref(storage, photoUrl);
            await deleteObject(photoRef);
          } catch (e) {
            console.warn('Storage delete warning:', e);
          }
        }
        return true;
      } catch (err) {
        console.error('Firestore delete student error:', err);
      }
    }

    localMemoryStudents = localMemoryStudents.filter((s) => s.studentId.toUpperCase() !== formattedId);
    return true;
  },

  // Toggle student active/inactive status
  async toggleStatus(studentId: string, currentStatus: 'active' | 'inactive'): Promise<'active' | 'inactive'> {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const formattedId = studentId.trim().toUpperCase();
    const now = new Date().toISOString();

    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'students'), where('studentId', '==', formattedId));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          await updateDoc(snapshot.docs[0].ref, {
            status: newStatus,
            updatedAt: now,
          });
          return newStatus;
        }
      } catch (err) {
        console.error('Firestore status toggle error:', err);
      }
    }

    const idx = localMemoryStudents.findIndex((s) => s.studentId.toUpperCase() === formattedId);
    if (idx !== -1) {
      localMemoryStudents[idx].status = newStatus;
      localMemoryStudents[idx].updatedAt = now;
    }
    return newStatus;
  },

  // Upload student photo to Firebase Storage with compression
  async uploadPhoto(file: File, studentId: string): Promise<string> {
    if (isFirebaseConfigured && storage) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const storageRef = ref(storage, `student-photos/${studentId}_${Date.now()}.${fileExt}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      } catch (err) {
        console.error('Firebase Storage upload error:', err);
      }
    }
    // Fallback: Convert to data URL string
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Bulk save list of students
  async bulkSaveStudents(studentsList: Omit<Student, 'id'>[]): Promise<number> {
    let count = 0;
    for (const studentData of studentsList) {
      await this.saveStudent(studentData);
      count++;
    }
    return count;
  },
};

export { auth, db, storage, isFirebaseConfigured };
