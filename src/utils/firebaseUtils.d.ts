export interface SiteConfig {
  whatsapp: string;
  logoUrl: string;
}

export function getSiteConfig(): Promise<SiteConfig>;
export function generateWhatsAppOrderLink(productName: string, price: number, whatsappNumber: string): string;