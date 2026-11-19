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
} else if (!admin.apps.length) {
  console.warn('WARNING: Firebase credentials not found.');
}

export default admin;import admin from '../config/firebase.js';

export const sendDeviceCommand = async (fcmToken, command, extraData = {}) => {
  if (!fcmToken) {
    console.warn('Skipping FCM send: No FCM token registered for device');
    return { success: false, reason: 'NO_TOKEN' };
  }

  if (!admin.apps.length) {
    console.warn('Skipping FCM send: Firebase Admin not initialized');
    return { success: false, reason: 'FIREBASE_NOT_INIT' };
  }

  const message = {
    token: fcmToken,
    android: {
      priority: 'high',
      ttl: 0,
    },
    data: {
      command: String(command),
      timestamp: String(Date.now()),
      ...Object.fromEntries(
        Object.entries(extraData).map(([k, v]) => [k, String(v)])
      ),
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log(`FCM Command [${command}] sent successfully:`, response);
    return { success: true, messageId: response };
  } catch (error) {
    console.error(`FCM Command [${command}] failed:`, error.message);
    return { success: false, error: error.message };
  }
};
