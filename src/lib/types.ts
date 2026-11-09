export interface ServiceItem {
  id: string;
  title: string;
  category: 'Aadhaar' | 'Passport' | 'PAN' | 'Certificates' | 'Identity' | 'Utility' | 'Printing' | 'Custom';
  icon: string;
  badge?: string;
  description: string;
  documents: string[];
  turnaroundTime: string;
  feeEstimate: string; // e.g. "₹120"
  numericPrice?: number;
  features: string[];
  isActive: boolean;
  orderRank: number;
  updatedAt?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category:
    | 'Customized Photo Frames'
    | 'Birthday Gifts'
    | 'Anniversary Gifts'
    | 'Wedding Gifts'
    | 'Personalized Gifts'
    | 'Gift Hampers'
    | 'Customized Printing'
    | 'New Gift Items'
    | 'Seasonal Products';
  tagline: string;
  description: string;
  price: number;
  discountPrice?: number;
  badge?: string;
  image: string;
  materials?: string;
  includedItems?: string[];
  popularSizes?: string[];
  features: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  orderRank: number;
  createdAt?: string;
  updatedAt?: string;
}

export type PrintColorMode = 'bw' | 'color';
export type PrintPaperSize = 'A4' | 'A5';
export type PrintSides = 'single' | 'double';
export type PrintStatus = 'QUEUED' | 'PRINTING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface PrintJob {
  id: string;
  orderNumber: string; // e.g. "SP-1001"
  customerName: string;
  customerPhone: string;
  documentName: string;
  documentUrl: string;
  documentType: 'pdf' | 'jpg' | 'jpeg' | 'png';
  documentSize: number; // in bytes
  pageCount: number;
  colorMode: PrintColorMode;
  paperSize: PrintPaperSize;
  sides: PrintSides;
  copies: number;
  pageRange?: string; // e.g. "All" or "1-3, 5"
  unitPrice: number;
  totalAmount: number; // in INR
  paymentStatus: PaymentStatus;
  paymentGateway?: 'razorpay' | 'upi' | 'cash';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  printStatus: PrintStatus;
  printerAssigned?: string;
  errorMessage?: string;
  createdAt: string;
  paidAt?: string;
  printedAt?: string;
  retryCount?: number;
  sourceIp?: string;
}

export interface PrinterAgentStatus {
  agentId: string;
  computerName: string;
  os: string;
  ipAddress?: string;
  status: 'ONLINE' | 'OFFLINE' | 'PRINTING' | 'BUSY';
  selectedPrinter: string;
  availablePrinters: string[];
  defaultPrinter?: string;
  lastHeartbeat: string;
  currentJobId?: string;
  lastPrintedJobId?: string;
  version: string;
}

export interface WebsiteSettings {
  shopName: string;
  shopTagline: string;
  shopPhone: string;
  shopWhatsApp: string;
  shopAddress: string;
  priceBwSingleA4: number;
  priceBwDoubleA4: number;
  priceColorSingleA4: number;
  priceColorDoubleA4: number;
  priceBwA5: number;
  priceColorA5: number;
  documentRetentionHours: number; // e.g. 24 hours
  activePrinterName: string;
  enableAutoPrint: boolean;
}

export interface CustomerEnquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  serviceOrProduct?: string;
  message: string;
  createdAt: string;
  status: 'NEW' | 'CONTACTED' | 'RESOLVED';
}

