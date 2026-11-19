import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// =====================================
// 1. PROTECT ROUTES - JWT Authentication
// =====================================

export const protect = async (req, res, next) => {
  try {
    // Authorization header प्राप्त करें
    const authHeader = req.headers.authorization;

    // Token मौजूद है या नहीं
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    // Bearer के बाद Token निकालें
    const token = authHeader.slice(7).trim();

    // Empty token check
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token is missing',
      });
    }

    // JWT format check
    const tokenParts = token.split('.');

    if (tokenParts.length !== 3) {
      return res.status(401).json({
        success: false,
        message: 'Invalid JWT token format',
      });
    }

    // JWT Secret check
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing in environment variables');

      return res.status(500).json({
        success: false,
        message: 'Server authentication configuration error',
      });
    }

    // Token verify करें
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Admin database में मौजूद है या नहीं
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found',
      });
    }

    // Request में Admin details attach करें
    req.admin = admin;

    // Next middleware/controller पर जाएँ
    next();

  } catch (error) {
    console.error('JWT ERROR:', error.name);
    console.error('JWT MESSAGE:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

// =====================================
// 2. ADMIN ONLY - Role Authorization
// =====================================

export const adminOnly = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.admin.role !== 'admin' && req.admin.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only',
    });
  }

  next();
};
