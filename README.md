# SIRAQ Studio Website

Modern design studio website for creative prints and supplies.

## Features

- Browse products and services
- Order via WhatsApp with pre-filled messages
- Admin dashboard for managing products and site configuration
- Logo upload and management with history
- Responsive design with modern UI

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Firebase (Authentication, Firestore, Storage)

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a Firebase project and configure the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Cloud Storage
4. Set up environment variables (see `.env.example`)
5. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

Deployed on Vercel. To deploy:

1. Push changes to GitHub
2. Connect repository to Vercel
3. Set the following environment variables in Vercel:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

## Admin Access

Admin dashboard is available at `/admin/login`. Default admin credentials need to be set up in Firebase Authentication.

## Logo Management

Admins can upload, manage, and revert logos through the admin dashboard:

1. Navigate to the "Site Logo & Branding" section
2. Upload a new logo (SVG, PNG, JPG, WebP - max 2MB)
3. View logo history and revert to previous versions
4. Remove current logo to revert to default

## Firebase Setup Steps

1. Create a Firebase project
2. Enable Authentication → Email/Password
3. Create an admin user in Authentication
4. Enable Firestore and Storage
5. Set up Firestore rules (see below)
6. Set up Storage rules (see below)

## Firestore Structure

```
site/
  config (document)
    whatsapp: string
    logoUrl: string
    logoUploadedBy: string
    logoUploadedAt: timestamp
    logoHistory: array of { url, uploadedBy, uploadedAt }

products/ (collection)
  doc: { name: string, price: number, description: string, imageUrl: string }
```

## Security Rules

### Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /site/config {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /products/{prod} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /site/logo/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Environment Variables

See `.env.example` for required variables.

## Custom Claims

To secure the admin dashboard properly:

1. Create an admin user in Firebase Authentication
2. Set custom claim `admin=true` using Firebase Admin SDK:

```javascript
const admin = require('firebase-admin');
admin.initializeApp();

const uid = 'USER_UID'; // Replace with actual user UID
admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('Custom claims set successfully');
  })
  .catch(error => {
    console.error('Error setting custom claims:', error);
  });
```