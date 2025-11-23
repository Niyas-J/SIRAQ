import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

/**
 * Fetch site configuration from Firestore
 * @returns {Promise<{whatsapp: string, logoUrl: string}>}
 */
export const getSiteConfig = async () => {
  try {
    const configRef = doc(db, 'site', 'config');
    const configSnap = await getDoc(configRef);
    
    if (configSnap.exists()) {
      return configSnap.data();
    } else {
      // Return default values if config doesn't exist
      return {
        whatsapp: '+918217469646', // Default WhatsApp number
        logoUrl: ''
      };
    }
  } catch (error) {
    console.error('Error fetching site config:', error);
    // Return defaults on error
    return {
      whatsapp: '+918217469646',
      logoUrl: ''
    };
  }
};

/**
 * Generate WhatsApp order link with product details
 * @param {string} productName 
 * @param {number} price 
 * @param {string} whatsappNumber 
 * @returns {string}
 */
export const generateWhatsAppOrderLink = (productName, price, whatsappNumber) => {
  const message = `Hi, I want to order: ${productName} (₹${price}). Please confirm.`;
  const encodedMessage = encodeURIComponent(message);
  // Remove any non-digit characters from the phone number
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};