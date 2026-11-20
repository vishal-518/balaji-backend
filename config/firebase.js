import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const credPath = process.env.FIREBASE_CREDENTIALS_PATH || './firebase-service-account.json';

try {
  if (fs.existsSync(credPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    }
    console.log('Firebase Admin Initialized Successfully');
  } else {
    console.warn('WARNING: Firebase credentials file not found at:', credPath);
  }
} catch (error) {
  console.error('Firebase Init Error:', error.message);
}

export { getApps, getMessaging };
