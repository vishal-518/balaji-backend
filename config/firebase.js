import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const serviceAccountPath = path.resolve('firebase-service-account.json');

try {
  if (existsSync(serviceAccountPath)) {
    const rawData = readFileSync(serviceAccountPath, 'utf8').trim();
    if (rawData) {
      const serviceAccount = JSON.parse(rawData);
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin Initialized Successfully');
      }
    } else {
      console.warn('WARNING: firebase-service-account.json is empty. Running in FCM simulation mode.');
    }
  } else {
    console.warn('WARNING: firebase-service-account.json not found. Running in FCM simulation mode.');
  }
} catch (error) {
  console.error('Firebase Config Warning:', error.message);
}

export default admin;