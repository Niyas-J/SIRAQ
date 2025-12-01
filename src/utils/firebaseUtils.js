import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebaseClient';

/**
 * Fetch site configuration from Firestore
 * @returns {Promise<{whatsapp: string, logoUrl: string, logoUploadedBy: string, logoUploadedAt: any, logoHistory: Array}>}
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
        logoUrl: '',
        logoUploadedBy: '',
        logoUploadedAt: null,
        logoHistory: []
      };
    }
  } catch (error) {
    console.error('Error fetching site config:', error);
    // Return defaults on error
    return {
      whatsapp: '+918217469646',
      logoUrl: '',
      logoUploadedBy: '',
      logoUploadedAt: null,
      logoHistory: []
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

/**
 * Upload logo to Firebase Storage and update site configuration
 * @param {File} logoFile 
 * @param {string} userEmail 
 * @returns {Promise<string>} Logo URL
 */
export const uploadLogo = async (logoFile, userEmail) => {
  try {
    // Validate file type
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(logoFile.type)) {
      throw new Error('Invalid file type. Please upload SVG, PNG, JPG, JPEG, or WebP files only.');
    }

    // Validate file size (2MB max)
    if (logoFile.size > 2 * 1024 * 1024) {
      throw new Error('File size exceeds 2MB limit.');
    }

    // Upload file to Firebase Storage
    const fileName = `site/logo/${Date.now()}_${logoFile.name}`;
    const logoRef = ref(storage, fileName);
    await uploadBytes(logoRef, logoFile);
    const logoUrl = await getDownloadURL(logoRef);

    // Get current config
    const currentConfig = await getSiteConfig();

    // Create new history entry
    const newHistoryEntry = {
      url: currentConfig.logoUrl,
      uploadedBy: currentConfig.logoUploadedBy,
      uploadedAt: currentConfig.logoUploadedAt
    };

    // Update logo history (keep only last 3)
    let logoHistory = currentConfig.logoHistory || [];
    if (newHistoryEntry.url) {
      logoHistory.unshift(newHistoryEntry);
    }
    logoHistory = logoHistory.slice(0, 3);

    // Update config in Firestore
    const configRef = doc(db, 'site', 'config');
    await setDoc(configRef, {
      ...currentConfig,
      logoUrl: logoUrl,
      logoUploadedBy: userEmail,
      logoUploadedAt: new Date(),
      logoHistory: logoHistory
    }, { merge: true });

    return logoUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
};

/**
 * Revert to a previous logo from history
 * @param {Object} historyEntry 
 * @returns {Promise<void>}
 */
export const revertToPreviousLogo = async (historyEntry) => {
  try {
    // Get current config
    const currentConfig = await getSiteConfig();

    // Create new history entry for current logo
    const newHistoryEntry = {
      url: currentConfig.logoUrl,
      uploadedBy: currentConfig.logoUploadedBy,
      uploadedAt: currentConfig.logoUploadedAt
    };

    // Update logo history (keep only last 3)
    let logoHistory = currentConfig.logoHistory || [];
    if (newHistoryEntry.url) {
      logoHistory.unshift(newHistoryEntry);
    }
    logoHistory = logoHistory.slice(0, 3);

    // Update config in Firestore
    const configRef = doc(db, 'site', 'config');
    await setDoc(configRef, {
      ...currentConfig,
      logoUrl: historyEntry.url,
      logoUploadedBy: historyEntry.uploadedBy,
      logoUploadedAt: historyEntry.uploadedAt,
      logoHistory: logoHistory.filter(entry => entry.url !== historyEntry.url)
    }, { merge: true });
  } catch (error) {
    console.error('Error reverting to previous logo:', error);
    throw error;
  }
};

/**
 * Remove current logo and revert to default
 * @returns {Promise<void>}
 */
export const removeLogo = async () => {
  try {
    // Get current config
    const currentConfig = await getSiteConfig();

    // Create new history entry for current logo
    const newHistoryEntry = {
      url: currentConfig.logoUrl,
      uploadedBy: currentConfig.logoUploadedBy,
      uploadedAt: currentConfig.logoUploadedAt
    };

    // Update logo history (keep only last 3)
    let logoHistory = currentConfig.logoHistory || [];
    if (newHistoryEntry.url) {
      logoHistory.unshift(newHistoryEntry);
    }
    logoHistory = logoHistory.slice(0, 3);

    // Update config in Firestore
    const configRef = doc(db, 'site', 'config');
    await setDoc(configRef, {
      ...currentConfig,
      logoUrl: '',
      logoUploadedBy: '',
      logoUploadedAt: null,
      logoHistory: logoHistory
    }, { merge: true });
  } catch (error) {
    console.error('Error removing logo:', error);
    throw error;
  }
};