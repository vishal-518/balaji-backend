import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shopName: { type: String, default: 'Balaji Communication' },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  upiId: { type: String, default: 'balajicommunication@upi' },
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema);