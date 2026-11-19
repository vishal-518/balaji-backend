import express from 'express';
import {
  saveCustomerInfo,
  getAllCustomerInfo,
  lockCustomerPhone,
  unlockCustomerPhone,
  syncCustomerPhone,
  getStats,
} from '../controllers/customerInfoController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Dealer App Routes (Protected)
router.post('/save', protect, saveCustomerInfo);
router.get('/all', protect, getAllCustomerInfo);
router.get('/stats', protect, getStats);
router.post('/lock', protect, lockCustomerPhone);
router.post('/unlock', protect, unlockCustomerPhone);

// Customer Mobile Locker App Route (Public)
router.post('/sync', syncCustomerPhone);

export default router;