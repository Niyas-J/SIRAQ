declare module '../../lib/firebaseClient' {
  import { Auth } from 'firebase/auth';
  import { Firestore } from 'firebase/firestore';
  import { FirebaseStorage } from 'firebase/storage';
  
  export const auth: Auth;
  export const db: Firestore;
  export const storage: FirebaseStorage;
  const app: any;
  export default app;
}