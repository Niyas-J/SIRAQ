/**
 * Script to set admin custom claim for a Firebase user
 * 
 * Usage:
 * 1. Install Firebase Admin SDK: npm install firebase-admin
 * 2. Set up service account key and environment variable GOOGLE_APPLICATION_CREDENTIALS
 * 3. Replace 'USER_UID' with the actual user's UID
 * 4. Run: node scripts/setAdminClaim.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Make sure to set the GOOGLE_APPLICATION_CREDENTIALS environment variable
// pointing to your service account key file
admin.initializeApp();

// Replace with the actual user's UID
const uid = 'USER_UID'; // <-- Replace this with actual user UID

async function setAdminClaim() {
  try {
    // Set custom user claims
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    
    console.log('Custom claim "admin: true" set successfully for user:', uid);
    
    // Verify the custom claims
    const user = await admin.auth().getUser(uid);
    console.log('User custom claims:', user.customClaims);
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
}

setAdminClaim();