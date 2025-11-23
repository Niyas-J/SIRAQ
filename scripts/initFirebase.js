/**
 * Script to initialize Firebase configuration
 * This script helps set up the initial Firebase configuration
 */

console.log('Firebase Configuration Setup Guide');
console.log('=================================');
console.log('');
console.log('1. Create a Firebase project at https://console.firebase.google.com/');
console.log('2. Register your web app in Firebase project settings');
console.log('3. Copy the Firebase configuration values:');
console.log('   - API Key');
console.log('   - Auth Domain');
console.log('   - Project ID');
console.log('   - Storage Bucket');
console.log('   - Messaging Sender ID');
console.log('   - App ID');
console.log('');
console.log('4. Add these values to your .env file or Vercel environment variables:');
console.log('   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key');
console.log('   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com');
console.log('   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id');
console.log('   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com');
console.log('   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id');
console.log('   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id');
console.log('');
console.log('5. Enable Firebase services:');
console.log('   - Authentication (Email/Password)');
console.log('   - Firestore Database');
console.log('   - Cloud Storage');
console.log('');
console.log('6. Create an admin user in Firebase Authentication');
console.log('7. Run scripts/setAdminClaim.js to set admin privileges');