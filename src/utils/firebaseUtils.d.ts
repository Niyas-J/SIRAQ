export interface SiteConfig {
  whatsapp: string;
  logoUrl: string;
  logoUploadedBy?: string;
  logoUploadedAt?: any;
  logoHistory?: Array<{
    url: string;
    uploadedBy: string;
    uploadedAt: any;
  }>;
}

export interface LogoHistoryEntry {
  url: string;
  uploadedBy: string;
  uploadedAt: any;
}

export function getSiteConfig(): Promise<SiteConfig>;
export function generateWhatsAppOrderLink(productName: string, price: number, whatsappNumber: string): string;
export function uploadLogo(logoFile: File, userEmail: string): Promise<string>;
export function revertToPreviousLogo(historyEntry: LogoHistoryEntry): Promise<void>;
export function removeLogo(): Promise<void>;