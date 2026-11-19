import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const registerAdmin = async (req, res, next) => {
  try {
    const { name, phone, password } = req.body;
    const exists = await Admin.findOne({ phone });
    if (exists) return res.status(400).json({ success: false, message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, phone, password: hashedPassword });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ success: true, token, admin });
  } catch (err) {
    next(err);
  }
};

// export const loginAdmin = async (req, res, next) => {
//   try {
//     const { phone, password } = req.body;
//     const admin = await Admin.findOne({ phone });
//     if (!admin || !(await bcrypt.compare(password, admin.password))) {
//       return res.status(401).json({ success: false, message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
//     res.json({ success: true, token, admin });
//   } catch (err) {
//     next(err);
//   }
// };


export const loginAdmin = async (req, res, next) => {
  try {
    console.log('\n========== ADMIN LOGIN START ==========');

    // 1. Frontend se received data
    console.log('LOGIN REQUEST BODY:', {
      phone: req.body.phone,
      passwordReceived: !!req.body.password,
    });

    const { phone, password } = req.body;

    // 2. Validate request
    if (!phone || !password) {
      console.log('ERROR: Phone or password missing');

      return res.status(400).json({
        success: false,
        message: 'Phone and password are required',
      });
    }

    // 3. Find admin in MongoDB
    const admin = await Admin.findOne({ phone });

    console.log(
      'ADMIN FOUND:',
      admin ? 'YES' : 'NO'
    );

    if (!admin) {
      console.log('LOGIN FAILED: Admin not found');

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // 4. Compare password
    const isPasswordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    console.log(
      'PASSWORD MATCH:',
      isPasswordMatch
    );

    if (!isPasswordMatch) {
      console.log('LOGIN FAILED: Wrong password');

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // 5. Generate JWT Token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('JWT TOKEN GENERATED: YES');

    // 6. Prepare response
    const responseData = {
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        phone: admin.phone,
      },
    };

    console.log('LOGIN RESPONSE:', {
      ...responseData,
      token: '[HIDDEN]',
    });

    console.log('========== ADMIN LOGIN SUCCESS ==========\n');

    return res.status(200).json(responseData);

  } catch (err) {
    console.error('LOGIN CONTROLLER ERROR:', err.message);
    next(err);
  }
};


export const getDealerProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ success: false, message: 'Dealer not found' });
    res.json({ success: true, dealer: admin });
  } catch (err) {
    next(err);
  }
};