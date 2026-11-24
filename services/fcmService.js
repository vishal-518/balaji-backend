// import admin from 'firebase-admin';
// import fs from 'fs';
// import dotenv from 'dotenv';

// dotenv.config();

// let serviceAccount;

// if (process.env.FIREBASE_SERVICE_ACCOUNT) {
//   serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
// } else if (process.env.FIREBASE_CREDENTIALS_PATH && fs.existsSync(process.env.FIREBASE_CREDENTIALS_PATH)) {
//   serviceAccount = JSON.parse(fs.readFileSync(process.env.FIREBASE_CREDENTIALS_PATH, 'utf8'));
// }

// if (serviceAccount && !admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
//   console.log('Firebase Admin Initialized Successfully');
// }

// export default admin;

import admin from '../config/firebase.js';

export const sendDeviceCommand = async (fcmToken, command, extraData = {}) => {
  if (!fcmToken) {
    console.log(`⚠️ No FCM Token found for command: ${command}`);
    return { success: false, message: 'No FCM token available' };
  }

  // FCM data payload ke sabhi values String format me hone chahiye
  const stringifiedExtras = {};
  for (const [key, value] of Object.entries(extraData)) {
    if (value !== undefined && value !== null) {
      stringifiedExtras[key] = String(value);
    }
  }

  const message = {
    token: fcmToken,
    data: {
      action: String(command),
      command: String(command),
      ...stringifiedExtras,
    },
    android: {
      priority: 'high',
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log(`✅ FCM Command [${command}] sent successfully:`, response);
    return { success: true, messageId: response };
  } catch (error) {
    console.error(`❌ FCM Send Error [${command}]:`, error.message);
    return { success: false, error: error.message };
  }
};