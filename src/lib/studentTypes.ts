export type StudentStatus = 'active' | 'inactive';

export interface Student {
  id?: string; // Firestore doc id
  studentId: string; // E.g., ST202600001
  name: string;
  photo: string; // URL or Base64/Data URI fallback
  institution: string;
  department: string;
  course: string;
  semester: string;
  section: string;
  rollNumber: string;
  bloodGroup: string;
  dob?: string;
  parentName: string;
  phone: string;
  email: string;
  address: string;
  admissionYear: string;
  status: StudentStatus;
  issueDate: string;
  expiryDate?: string;
  scanCount: number;
  lastScannedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastEditedBy: string;
}

export interface StudentFormData {
  studentId: string;
  name: string;
  photo?: string;
  institution: string;
  department: string;
  course: string;
  semester: string;
  section: string;
  rollNumber: string;
  bloodGroup: string;
  dob?: string;
  parentName: string;
  phone: string;
  email: string;
  address: string;
  admissionYear: string;
  status: StudentStatus;
  issueDate: string;
  expiryDate?: string;
}

export interface StudentFilters {
  search: string;
  department: string;
  institution: string;
  status: string;
  sortBy: 'createdAt' | 'name' | 'studentId';
  sortOrder: 'asc' | 'desc';
}
