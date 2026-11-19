import admin from '../config/firebase.js';

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
