import { messaging } from '../config/firebase.js';

export const sendDeviceCommand = async (fcmToken, command, extraData = {}) => {
  if (!fcmToken) {
    console.log(`⚠️ No FCM Token found for command: ${command}`);
    return { success: false, message: 'No FCM token available' };
  }

  if (!messaging) {
    console.error(`❌ Firebase Messaging not initialized. Cannot send [${command}]`);
    return { success: false, message: 'Firebase not initialized on server' };
  }

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
    const response = await messaging.send(message);
    console.log(`✅ FCM Command [${command}] sent successfully:`, response);
    return { success: true, messageId: response };
  } catch (error) {
    console.error(`❌ FCM Send Error [${command}]:`, error.message);
    return { success: false, error: error.message };
  }
};
