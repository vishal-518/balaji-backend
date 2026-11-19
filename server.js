import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import './config/firebase.js';
import mainRoutes from './routes/index.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Rate Limiting (Brute-force protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/v1', limiter);

const PORT = process.env.PORT || 5000;

await connectDB();

app.get('/', (req, res) => {
  res.json({
    status: 200,
    msg: 'Balaji Locker Production API Running',
    success: true,
  });
});

app.use('/api/v1', mainRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Production Server running on port ${PORT}`);
});