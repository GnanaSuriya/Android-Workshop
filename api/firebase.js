import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  let credential;
  const keyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (keyString) {
    try {
      let parsedKey;
      try {
        // Try parsing as raw JSON
        parsedKey = JSON.parse(keyString);
      } catch (e) {
        // Fallback: try decoding Base64 if raw JSON fails
        const decoded = Buffer.from(keyString, 'base64').toString('utf8');
        parsedKey = JSON.parse(decoded);
      }
      credential = cert(parsedKey);
    } catch (err) {
      console.error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format');
    }
  } else {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is missing');
  }

  initializeApp(credential ? { credential } : undefined);
}

export const db = getFirestore();
