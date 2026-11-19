// import admin from '../config/firebase.js';

// export const sendDeviceCommand = async (fcmToken, action, payload = {}) => {
//   if (!fcmToken) {
//     console.log(`[SIMULATED FCM] Action: ${action} (No FCM Token registered yet)`);
//     return { simulated: true };
//   }

//   if (!admin.apps.length) {
//     console.log(`[SIMULATED FCM] Firebase not configured. Action: ${action}`);
//     return { simulated: true };
//   }

//   const message = {
//     token: fcmToken,
//     data: {
//       action: action, // 'LOCK_DEVICE' or 'UNLOCK_DEVICE'
//       amount: String(payload.amount || 0),
//       reason: String(payload.reason || 'EMI Overdue - Balaji Communication'),
//       shopPhone: '9636690689',
//     },
//     android: {
//       priority: 'high',
//     },
//   };

//   const response = await admin.messaging().send(message);
//   console.log(`FCM ${action} sent successfully:`, response);
//   return response;
// };

import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else if (process.env.FIREBASE_CREDENTIALS_PATH && fs.existsSync(process.env.FIREBASE_CREDENTIALS_PATH)) {
  serviceAccount = JSON.parse(fs.readFileSync(process.env.FIREBASE_CREDENTIALS_PATH, 'utf8'));
}

if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin Initialized Successfully');
}

export default admin;