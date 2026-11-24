import mongoose from 'mongoose';

const customerInfoSchema = new mongoose.Schema({
  // Customer KYC & Contact Details
  customerPhoto: { type: String, default: '' }, // Image URL ya Base64 string
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  alternateName: { type: String, default: '', trim: true },
  alternateNumber: { type: String, default: '', trim: true },
  address: { type: String, default: 'Kalwara, Jaipur', trim: true },

  // Phone & IMEI Details
  imei1: { type: String, required: true, unique: true, trim: true },
  imei2: { type: String, default: '', trim: true },
  model: { type: String, default: 'Android Smartphone' },

  // EMI & Locking System Fields
  emiAmount: { type: Number, default: 0 },
  totalEmis: { type: Number, default: 6 },
  paidEmis: { type: Number, default: 0 },
  fcmToken: { type: String, default: '' },
  isLocked: { type: Boolean, default: false },
  lockReason: { type: String, default: '' },
  status: {
    type: String,
    enum: ['ACTIVE', 'RELEASED'],
    default: 'ACTIVE',
  },
  battery: { type: Number, default: 100 },
  location: { type: String, default: 'Kalwara, Jaipur' },
  lastSync: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('CustomerInfo', customerInfoSchema);