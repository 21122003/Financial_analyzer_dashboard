// File: src/app.ts

import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';

// Import routes
import { authRoutes } from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import { dashboardRoutes } from './routes/dashboardRoutes';

const app: Application = express();

// Security middleware
app.use(helmet({
 crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ✅ Correct CORS configuration (only once)
app.use(cors({
 origin: 'http://localhost:3000', // direct URL to frontend
 credentials: true,
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
 allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
 windowMs: config.RATE_LIMIT_WINDOW_MS,
 max: config.RATE_LIMIT_MAX_REQUESTS,
 message: {
  success: false,
  message: 'Too many requests from this IP, please try again later.'
 },
 standardHeaders: true,
 legacyHeaders: false
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
 res.status(200).json({
  success: true,
  message: 'Server is healthy',
  timestamp: new Date().toISOString(),
  environment: config.NODE_ENV
 });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/json-transactions', transactionRoutes); // for your local JSON file

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

export default app;