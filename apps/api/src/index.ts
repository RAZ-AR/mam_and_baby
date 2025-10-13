import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import passport from './lib/passport.js';
import { router as listings } from './routes/listings';
import { router as iso } from './routes/iso';
import { router as auth } from './routes/auth';
import { router as upload } from './routes/upload';
import orders from './routes/orders';
import oauth from './routes/oauth.js';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to be loaded
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all requests
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
});

app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
}));

// Initialize Passport
app.use(passport.initialize());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (_,res)=> res.json({ ok:true, name:'belgrade-mama-api' }));

// Apply stricter rate limiting to auth routes
app.use('/auth', authLimiter, auth);

// OAuth routes (no rate limiting on OAuth to allow provider redirects)
app.use('/auth', oauth);

// Apply routes
app.use('/listings', listings);
app.use('/iso', iso);
app.use('/upload', upload);
app.use('/orders', orders);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, ()=> console.log(`API on :${port}`));
