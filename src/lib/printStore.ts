import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { PrintJob, PrintStatus, PaymentStatus, WebsiteSettings } from './types';

export const DEFAULT_SETTINGS: WebsiteSettings = {
  shopName: 'SIRAQ Smart Print & Digital Hub',
  shopTagline: 'SCAN. UPLOAD. PAY. PRINT.',
  shopPhone: '+91 8217469646',
  shopWhatsApp: '+91 8217469646',
  shopAddress: 'SIRAQ Center, Main Road, Shop Counter',
  priceBwSingleA4: 2.0,
  priceBwDoubleA4: 3.5,
  priceColorSingleA4: 10.0,
  priceColorDoubleA4: 18.0,
  priceBwA5: 1.5,
  priceColorA5: 8.0,
  documentRetentionHours: 24,
  activePrinterName: 'Canon G3010 series',
  enableAutoPrint: true,
};

let memorySettings: WebsiteSettings = { ...DEFAULT_SETTINGS };
let memoryPrintJobs: PrintJob[] = [
  {
    id: 'sp_demo_1',
    orderNumber: 'SP-1001',
    customerName: 'Aadhavan Raman',
    customerPhone: '+91 98765 43210',
    documentName: 'Project_Synopsis_Final.pdf',
    documentUrl: '/uploads/sample-doc.pdf',
    documentType: 'pdf',
    documentSize: 1420500,
    pageCount: 5,
    colorMode: 'bw',
    paperSize: 'A4',
    sides: 'single',
    copies: 2,
    pageRange: 'All',
    unitPrice: 2,
    totalAmount: 20,
    paymentStatus: 'PAID',
    paymentGateway: 'razorpay',
    razorpayPaymentId: 'pay_demo_test1',
    printStatus: 'COMPLETED',
    printerAssigned: 'Canon G3010 series',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    paidAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    printedAt: new Date(Date.now() - 3600000 * 1.9).toISOString(),
  },
  {
    id: 'sp_demo_2',
    orderNumber: 'SP-1002',
    customerName: 'Fatima Zohra',
    customerPhone: '+91 98451 12345',
    documentName: 'Color_Certificate_Aadhaar.pdf',
    documentUrl: '/uploads/sample-doc.pdf',
    documentType: 'pdf',
    documentSize: 845000,
    pageCount: 2,
    colorMode: 'color',
    paperSize: 'A4',
    sides: 'single',
    copies: 1,
    pageRange: 'All',
    unitPrice: 10,
    totalAmount: 20,
    paymentStatus: 'PAID',
    paymentGateway: 'razorpay',
    razorpayPaymentId: 'pay_demo_test2',
    printStatus: 'COMPLETED',
    printerAssigned: 'Canon G3010 series',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    paidAt: new Date(Date.now() - 3600000).toISOString(),
    printedAt: new Date(Date.now() - 3500000).toISOString(),
  },
];

export const printStore = {
  // Website & Printing pricing settings
  async getSettings(): Promise<WebsiteSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'settings', 'website_config'));
        if (snap.exists()) {
          return { ...DEFAULT_SETTINGS, ...snap.data() } as WebsiteSettings;
        } else {
          await setDoc(doc(db, 'settings', 'website_config'), DEFAULT_SETTINGS);
          return DEFAULT_SETTINGS;
        }
      } catch (err) {
        console.error('Firestore getSettings error:', err);
      }
    }
    return { ...memorySettings };
  },

  async updateSettings(newSettings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    const updated = { ...memorySettings, ...newSettings };
    memorySettings = updated;

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'website_config'), updated, { merge: true });
      } catch (err) {
        console.error('Firestore updateSettings error:', err);
      }
    }
    return updated;
  },

  // Calculate print cost based on options
  async calculatePrice(params: {
    pageCount: number;
    copies: number;
    colorMode: 'bw' | 'color';
    paperSize: 'A4' | 'A5';
    sides: 'single' | 'double';
  }): Promise<{ unitPrice: number; totalAmount: number }> {
    const settings = await this.getSettings();
    let unitPrice = 2.0;

    if (params.paperSize === 'A4') {
      if (params.colorMode === 'bw') {
        unitPrice = params.sides === 'double' ? settings.priceBwDoubleA4 / 2 : settings.priceBwSingleA4;
      } else {
        unitPrice = params.sides === 'double' ? settings.priceColorDoubleA4 / 2 : settings.priceColorSingleA4;
      }
    } else {
      // A5
      unitPrice = params.colorMode === 'bw' ? settings.priceBwA5 : settings.priceColorA5;
    }

    const totalPages = Math.max(1, params.pageCount) * Math.max(1, params.copies);
    const totalAmount = Math.max(1, Math.round(totalPages * unitPrice));
    return { unitPrice, totalAmount };
  },

  // Create a new print job
  async createJob(data: Omit<PrintJob, 'id' | 'orderNumber' | 'createdAt' | 'printStatus'>): Promise<PrintJob> {
    const now = new Date().toISOString();
    const orderNumber = `SP-${Math.floor(1000 + Math.random() * 9000)}`;
    const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newJob: PrintJob = {
      ...data,
      id,
      orderNumber,
      createdAt: now,
      printStatus: 'QUEUED', // will wait for payment confirmation if paymentStatus is PENDING
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'print_jobs', id), newJob);
        return newJob;
      } catch (err) {
        console.error('Firestore createJob error:', err);
      }
    }

    memoryPrintJobs.unshift(newJob);
    return newJob;
  },

  // Get job by ID
  async getJobById(id: string): Promise<PrintJob | null> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'print_jobs', id));
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() } as PrintJob;
        }
      } catch (err) {
        console.error('Firestore getJobById error:', err);
      }
    }
    const found = memoryPrintJobs.find((j) => j.id === id || j.orderNumber === id);
    return found || null;
  },

  // Mark payment verified
  async markPaymentPaid(
    jobId: string,
    paymentDetails: {
      gateway: 'razorpay' | 'upi';
      paymentId: string;
      orderId?: string;
      signature?: string;
    }
  ): Promise<PrintJob | null> {
    const now = new Date().toISOString();
    const updates = {
      paymentStatus: 'PAID' as PaymentStatus,
      paymentGateway: paymentDetails.gateway,
      razorpayPaymentId: paymentDetails.paymentId,
      razorpayOrderId: paymentDetails.orderId,
      razorpaySignature: paymentDetails.signature,
      paidAt: now,
      printStatus: 'QUEUED' as PrintStatus, // Now approved and eligible to print!
    };

    if (isFirebaseConfigured && db) {
      try {
        const ref = doc(db, 'print_jobs', jobId);
        await updateDoc(ref, updates);
        const updatedSnap = await getDoc(ref);
        return { id: updatedSnap.id, ...updatedSnap.data() } as PrintJob;
      } catch (err) {
        console.error('Firestore markPaymentPaid error:', err);
      }
    }

    const idx = memoryPrintJobs.findIndex((j) => j.id === jobId);
    if (idx !== -1) {
      memoryPrintJobs[idx] = { ...memoryPrintJobs[idx], ...updates };
      return memoryPrintJobs[idx];
    }
    return null;
  },

  // Get next approved queued jobs for local print agent
  async getQueuedJobsForAgent(limitCount = 5): Promise<PrintJob[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(
          collection(db, 'print_jobs'),
          where('paymentStatus', '==', 'PAID'),
          where('printStatus', '==', 'QUEUED')
        );
        const snap = await getDocs(q);
        const list: PrintJob[] = [];
        snap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as PrintJob);
        });
        return list.slice(0, limitCount);
      } catch (err) {
        console.error('Firestore getQueuedJobs error:', err);
      }
    }

    return memoryPrintJobs
      .filter((j) => j.paymentStatus === 'PAID' && j.printStatus === 'QUEUED')
      .slice(0, limitCount);
  },

  // Update print status
  async updatePrintStatus(
    jobId: string,
    status: PrintStatus,
    extra?: { printerAssigned?: string; errorMessage?: string }
  ): Promise<boolean> {
    const now = new Date().toISOString();
    const updates: any = {
      printStatus: status,
      ...(status === 'COMPLETED' ? { printedAt: now } : {}),
      ...(extra?.printerAssigned ? { printerAssigned: extra.printerAssigned } : {}),
      ...(extra?.errorMessage ? { errorMessage: extra.errorMessage } : {}),
    };

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'print_jobs', jobId), updates);
        return true;
      } catch (err) {
        console.error('Firestore updatePrintStatus error:', err);
      }
    }

    const idx = memoryPrintJobs.findIndex((j) => j.id === jobId);
    if (idx !== -1) {
      memoryPrintJobs[idx] = { ...memoryPrintJobs[idx], ...updates };
      return true;
    }
    return false;
  },

  // Get full print queue for Admin dashboard
  async getAllPrintJobs(): Promise<PrintJob[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'print_jobs'));
        const list: PrintJob[] = [];
        snap.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as PrintJob);
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (list.length > 0) return list;
      } catch (err) {
        console.error('Firestore getAllPrintJobs error:', err);
      }
    }
    return [...memoryPrintJobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Trigger retry for failed job
  async retryJob(jobId: string): Promise<boolean> {
    const job = await this.getJobById(jobId);
    if (!job || job.paymentStatus !== 'PAID') return false;

    return this.updatePrintStatus(jobId, 'QUEUED', { errorMessage: '' });
  },

  // Cancel eligible job
  async cancelJob(jobId: string): Promise<boolean> {
    return this.updatePrintStatus(jobId, 'CANCELLED', { errorMessage: 'Cancelled by administrator' });
  },
};

