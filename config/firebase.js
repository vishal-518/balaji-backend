import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

let firebaseApp = null;

try {
  let serviceAccount = null;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    const credPath = path.resolve(process.env.FIREBASE_CREDENTIALS_PATH || 'firebase-service-account.json');
    if (existsSync(credPath)) {
      const rawData = readFileSync(credPath, 'utf8').trim();
      if (rawData) {
        serviceAccount = JSON.parse(rawData);
      }
    }
  }

  if (serviceAccount) {
    firebaseApp = getApps().length === 0
      ? initializeApp({ credential: cert(serviceAccount) })
      : getApps()[0];
    console.log('✅ Firebase Admin Initialized Successfully');
  } else {
    console.warn('⚠️ WARNING: Firebase credentials missing. Running in FCM simulation mode.');
  }
} catch (error) {
  console.error('❌ Firebase Config Error:', error.message);
}

export const messaging = firebaseApp ? getMessaging(firebaseApp) : null;
export default firebaseApp;
