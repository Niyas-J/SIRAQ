import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { PrinterAgentStatus } from './types';
import { printStore } from './printStore';

const DEFAULT_AGENT_STATUS: PrinterAgentStatus = {
  agentId: 'shop-agent-win11-01',
  computerName: 'SIRAQ-SHOP-PC',
  os: 'Windows 11 Pro 64-bit',
  status: 'ONLINE',
  selectedPrinter: 'Canon G3010 series',
  availablePrinters: [
    'Canon G3010 series',
    'Microsoft Print to PDF',
    'OneNote (Desktop)',
    'KONICA MINOLTA Universal PCL',
    'Solid Edge PS Printer 3.0',
  ],
  defaultPrinter: 'Canon G3010 series',
  lastHeartbeat: new Date().toISOString(),
  version: '1.0.4-win11',
};

let memoryAgentStatus: PrinterAgentStatus = { ...DEFAULT_AGENT_STATUS };

export const agentStore = {
  async getStatus(): Promise<PrinterAgentStatus> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'printer_status', 'agent_main'));
        if (snap.exists()) {
          const data = snap.data() as PrinterAgentStatus;
          // Check if heartbeat is stale (older than 45 seconds)
          const isStale = Date.now() - new Date(data.lastHeartbeat).getTime() > 45000;
          return {
            ...data,
            status: isStale ? 'OFFLINE' : data.status,
          };
        }
      } catch (err) {
        console.error('Firestore getStatus error:', err);
      }
    }

    // Check memory heartbeat
    const isStale = Date.now() - new Date(memoryAgentStatus.lastHeartbeat).getTime() > 45000;
    return {
      ...memoryAgentStatus,
      status: isStale ? 'OFFLINE' : memoryAgentStatus.status,
    };
  },

  async recordHeartbeat(data: Partial<PrinterAgentStatus>): Promise<PrinterAgentStatus> {
    const updated: PrinterAgentStatus = {
      ...memoryAgentStatus,
      ...data,
      lastHeartbeat: new Date().toISOString(),
      status: (data.status as any) || 'ONLINE',
    };
    memoryAgentStatus = updated;

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'printer_status', 'agent_main'), updated, { merge: true });
      } catch (err) {
        console.error('Firestore recordHeartbeat error:', err);
      }
    }

    return updated;
  },

  async setSelectedPrinter(printerName: string): Promise<boolean> {
    memoryAgentStatus.selectedPrinter = printerName;
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'printer_status', 'agent_main'), {
          selectedPrinter: printerName,
        });
      } catch (err) {
        console.error('Firestore setSelectedPrinter error:', err);
      }
    }
    return true;
  },

  async createTestPrintJob(): Promise<string> {
    const job = await printStore.createJob({
      customerName: 'Admin (System Test)',
      customerPhone: '+91 8217469646',
      documentName: 'SIRAQ_PRINTER_TEST_PAGE.pdf',
      documentUrl: '/uploads/sample-doc.pdf',
      documentType: 'pdf',
      documentSize: 42000,
      pageCount: 1,
      colorMode: 'bw',
      paperSize: 'A4',
      sides: 'single',
      copies: 1,
      pageRange: '1',
      unitPrice: 0,
      totalAmount: 0,
      paymentStatus: 'PAID', // bypass payment for admin self-test
      paymentGateway: 'cash',
      razorpayPaymentId: 'test_admin_verified',
    });

    return job.orderNumber;
  },
};

