import Device from '../models/Device.js';
import { sendDeviceCommand } from '../services/fcmService.js';

export const paymentWebhook = async (req, res, next) => {
  try {
    const { imei, status } = req.body;
    if (status === 'captured' && imei) {
      const device = await Device.findOne({ imei1: imei });
      if (device) {
        device.isLocked = false;
        device.lockReason = '';
        await device.save();
        await sendDeviceCommand(device.fcmToken, 'UNLOCK_DEVICE');
      }
    }
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};