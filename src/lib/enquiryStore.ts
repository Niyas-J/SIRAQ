import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { CustomerEnquiry } from './types';

let memoryEnquiries: CustomerEnquiry[] = [
  {
    id: 'enq_demo_1',
    name: 'Mohammed Arshad',
    phone: '+91 98451 23456',
    email: 'arshad.m@example.com',
    studentName: 'Mohammed Arshad',
    scholarshipName: 'SSP - Karnataka State Scholarship Portal',
    scholarshipWebsite: 'https://ssp.postmatric.karnataka.gov.in',
    additionalInfo: 'Need assistance for Post-Matric engineering hostel fee reimbursement application.',
    type: 'SCHOLARSHIP',
    serviceOrProduct: 'Scholarship Application',
    message: 'Need help filing Karnataka SSP Post-Matric renewal.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'NEW',
  },
  {
    id: 'enq_demo_2',
    name: 'Ananya Sharma',
    phone: '+91 97412 88901',
    email: 'ananya.s@example.com',
    studentName: 'Ananya Sharma',
    scholarshipName: 'NSP - National Scholarship Portal',
    scholarshipWebsite: 'https://scholarships.gov.in',
    additionalInfo: 'Central Sector Scheme of Scholarship for College and University Students.',
    type: 'SCHOLARSHIP',
    serviceOrProduct: 'Scholarship Application',
    message: 'Applying for NSP Fresh 2026-27 scheme.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'CONTACTED',
  },
];

export const enquiryStore = {
  async getAllEnquiries(): Promise<CustomerEnquiry[]> {
    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, 'enquiries');
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          const items: CustomerEnquiry[] = [];
          snapshot.forEach((snap) => {
            items.push({ id: snap.id, ...snap.data() } as CustomerEnquiry);
          });
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return items;
        } else {
          // seed initial
          for (const item of memoryEnquiries) {
            await setDoc(doc(db, 'enquiries', item.id), item);
          }
        }
      } catch (err) {
        console.error('Firestore getAllEnquiries error:', err);
      }
    }
    return [...memoryEnquiries];
  },

  async createEnquiry(data: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'status'>): Promise<CustomerEnquiry> {
    const id = `enq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newEnquiry: CustomerEnquiry = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      status: 'NEW',
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'enquiries', id), newEnquiry);
        return newEnquiry;
      } catch (err) {
        console.error('Firestore createEnquiry error:', err);
      }
    }

    memoryEnquiries.unshift(newEnquiry);
    return newEnquiry;
  },

  async updateStatus(id: string, status: 'NEW' | 'CONTACTED' | 'RESOLVED'): Promise<boolean> {
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'enquiries', id), { status });
        return true;
      } catch (err) {
        console.error('Firestore updateStatus error:', err);
      }
    }
    const item = memoryEnquiries.find((e) => e.id === id);
    if (item) {
      item.status = status;
      return true;
    }
    return false;
  },

  async deleteEnquiry(id: string): Promise<boolean> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'enquiries', id));
        return true;
      } catch (err) {
        console.error('Firestore deleteEnquiry error:', err);
      }
    }
    memoryEnquiries = memoryEnquiries.filter((e) => e.id !== id);
    return true;
  },
};

