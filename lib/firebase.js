// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAHTAnVG9YFRGaSRcwksRMJj2Tkmh2PBhE",
  authDomain: "ai-tools-hub-d6205.firebaseapp.com",
  projectId: "ai-tools-hub-d6205",
  storageBucket: "ai-tools-hub-d6205.firebasestorage.app",
  messagingSenderId: "1058325484791",
  appId: "1:1058325484791:web:5705695f53a02845ec6ff2",
  measurementId: "G-BN37CSD20P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only in browser environment
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
