import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';

// Initialize Firebase Admin SDK
export function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    // Check if we have the required environment variables
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-5484315123-df372';
    
    // In development, we need to use service account credentials
    // In production, Firebase App Hosting provides credentials automatically
    if (process.env.NODE_ENV === 'development') {
      // Check if we have service account credentials
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
          const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
          initializeApp({
            credential: credential.cert(serviceAccount),
            projectId: projectId
          });
        } catch (error) {
          console.error('Error parsing service account key:', error);
          // Fallback to default initialization with project ID
          initializeApp({
            projectId: projectId
          });
        }
      } else {
        // Fallback to default initialization with project ID
        initializeApp({
          projectId: projectId
        });
      }
    } else {
      // In production, Firebase App Hosting provides credentials automatically
      initializeApp({
        projectId: projectId
      });
    }
  }
}

export { getAuth, getFirestore };