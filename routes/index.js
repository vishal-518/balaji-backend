import express from 'express';
import authRoutes from './authRoutes.js';
import { protect } from '../middlewares/authMiddleware.js';
import customerInfoRoutes from './customerInfoRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/customer-info', customerInfoRoutes);

export default router;