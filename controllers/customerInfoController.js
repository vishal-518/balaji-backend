import CustomerInfo from '../models/CustomerInfo.js';
import { sendDeviceCommand } from '../services/fcmService.js';
import { buildProvisioningPayload } from '../services/qrService.js';

// 1. Save Customer & Enroll Phone (Single Button Action)
export const saveCustomerInfo = async (req, res, next) => {
  try {
    const {
      customerPhoto,
      name,
      phone,
      alternateName,
      alternateNumber,
      address,
      imei1,
      imei2,
      model,
      emiAmount,
      totalEmis,
    } = req.body;

    // Check karein ki IMEI 1 pehle se registered to nahi hai
    const existing = await CustomerInfo.findOne({ imei1 });
    if (existing) {
      return res.status(400).json({ success: false, message: 'IMEI 1 already registered!' });
    }

    // Ek hi document me sab save karein
    const customerRecord = await CustomerInfo.create({
      customerPhoto: customerPhoto || '',
      name,
      phone,
      alternateName: alternateName || '',
      alternateNumber: alternateNumber || '',
      address: address || 'Kalwara, Jaipur',
      imei1,
      imei2: imei2 || '',
      model: model || 'Android Smartphone',
      emiAmount: Number(emiAmount) || 0,
      totalEmis: Number(totalEmis) || 6,
    });

    // 6-Tap QR Code payload banayein
    const qrPayload = buildProvisioningPayload(imei1);

    res.status(201).json({
      success: true,
      message: 'Customer & Device saved successfully!',
      customer: customerRecord,
      qrPayload,
    });
  } catch (err) {
    next(err);
  }
};

// 2. Get All Saved Customers & Devices
export const getAllCustomerInfo = async (req, res, next) => {
  try {
    const list = await CustomerInfo.find().sort({ createdAt: -1 });
    res.json({ success: true, customers: list });
  } catch (err) {
    next(err);
  }
};

// 3. Force Lock Phone
export const lockCustomerPhone = async (req, res, next) => {
  try {
    const { id, amount, reason } = req.body;
    const record = await CustomerInfo.findById(id);
    if (!record) return res.status(404).json({ success: false, message: 'Customer record not found' });

    record.isLocked = true;
    record.lockReason = reason || 'EMI Overdue - Balaji Communication';
    await record.save();

    await sendDeviceCommand(record.fcmToken, 'LOCK_DEVICE', {
      amount: amount || record.emiAmount,
      reason: record.lockReason,
    });

    res.json({ success: true, message: 'Device locked successfully', customer: record });
  } catch (err) {
    next(err);
  }
};

// 4. Remote Unlock Phone
export const unlockCustomerPhone = async (req, res, next) => {
  try {
    const { id } = req.body;
    const record = await CustomerInfo.findById(id);
    if (!record) return res.status(404).json({ success: false, message: 'Customer record not found' });

    record.isLocked = false;
    record.lockReason = '';
    await record.save();

    await sendDeviceCommand(record.fcmToken, 'UNLOCK_DEVICE');

    res.json({ success: true, message: 'Device unlocked successfully', customer: record });
  } catch (err) {
    next(err);
  }
};

// 5. Sync Customer Phone (Public Route for Android App)
export const syncCustomerPhone = async (req, res, next) => {
  try {
    const { customerId, imei, imei1, fcmToken, battery, location } = req.body;
    const targetImei = imei1 || imei;

    const query = customerId
      ? { _id: customerId }
      : { $or: [{ imei1: targetImei }, { imei2: targetImei }] };

    const record = await CustomerInfo.findOne(query);
    if (!record) return res.status(404).json({ success: false, message: 'Device not found' });

    if (fcmToken) record.fcmToken = fcmToken;
    if (battery !== undefined) record.battery = battery;
    if (location) record.location = location;
    record.lastSync = new Date();
    await record.save();

    res.json({
      success: true,
      isLocked: record.isLocked,
      emiAmount: record.emiAmount,
      lockReason: record.lockReason,
      status: record.status || 'ACTIVE',
    });
  } catch (err) {
    next(err);
  }
};

// 6. Dashboard Summary Stats
export const getStats = async (req, res, next) => {
  try {
    const totalDevices = await CustomerInfo.countDocuments();
    const lockedDevices = await CustomerInfo.countDocuments({ isLocked: true });
    const overdueEmis = await Emi.find({ status: 'OVERDUE' });
    const totalOverdueAmount = overdueEmis.reduce((sum, item) => sum + item.amount, 0);

    res.json({
      success: true,
      stats: { totalDevices, lockedDevices, totalOverdueAmount },
    });
  } catch (err) {
    next(err);
  }
};

// 7. Permanent Release Device Owner (Remove Kit after Full EMI Payment)
export const releaseCustomerDevice = async (req, res, next) => {
  try {
    const { id } = req.body;
    const record = await CustomerInfo.findById(id);
    if (!record) return res.status(404).json({ success: false, message: 'Customer record not found' });

    if (record.fcmToken) {
      await sendDeviceCommand(record.fcmToken, 'RELEASE_DEVICE');
    }

    record.isLocked = false;
    record.lockReason = '';
    record.status = 'RELEASED';
    await record.save();

    res.json({
      success: true,
      message: 'Device Owner release command sent successfully!',
      customer: record,
    });
  } catch (err) {
    next(err);
  }
};