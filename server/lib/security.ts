import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// ==========================================
// 1. IN-MEMORY TOKEN-BUCKET RATE LIMITER
// Protects login, OTP, and order placement
// ==========================================
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale rate limits periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

export function createRateLimiter(options: {
  windowMs: number; // e.g. 60000 (1 min)
  max: number;      // max requests per window
  message?: string;
}) {
  const { windowMs, max, message } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const key = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();

    const record = rateLimitStore.get(key as string);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key as string, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (record.count >= max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        error: message || 'Too many requests. Please slow down and try again.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfterSeconds: retryAfter,
      });
    }

    record.count++;
    next();
  };
}

// Pre-configured rate limiters
export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 15,
  message: 'খুব বেশি লগইন চেষ্টা করা হয়েছে। অনুগ্রহ করে ১৫ মিনিট পর আবার চেষ্টা করুন। (Too many login attempts)',
});

export const otpRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 5,
  message: 'ওটিপি পাঠানোর সর্বোচ্চ সীমা অতিক্রম হয়েছে। কিছুক্ষণ পর চেষ্টা করুন। (Too many OTP requests)',
});

export const orderPlacementRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 20,
  message: 'অর্ডার তৈরির সীমা অতিক্রম হয়েছে। কিছুক্ষণ অপেক্ষা করুন। (Too many order placement requests)',
});

// ==========================================
// 2. INPUT SANITIZATION
// Prevents XSS, Script Injection, and Corrupted HTML
// ==========================================
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '') // Strip angle brackets
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export function sanitizeObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return (typeof obj === 'string' ? sanitizeString(obj) : obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as unknown as T;
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}

export function sanitizationMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  next();
}

// ==========================================
// 3. SERVER-SIDE ZOD VALIDATION SCHEMAS
// ==========================================

export const LoginSchema = z.object({
  email: z.string().email({ message: 'সঠিক ইমেইল ঠিকানা প্রদান করুন (Valid email required)' }),
  password: z.string().min(6, { message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে (Minimum 6 characters)' }),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'নাম কমপক্ষে ২ অক্ষরের হতে হবে (Name is required)' }),
  email: z.string().email({ message: 'সঠিক ইমেইল ঠিকানা প্রদান করুন (Valid email required)' }),
  password: z.string().min(6, { message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে (Minimum 6 characters)' }),
  phone: z.string().regex(/^(\+88)?01[3-9]\d{8}$/, { message: 'সঠিক ১১ ডিজিটের বাংলাদেশি ফোন নম্বর দিন (Valid 11-digit BD phone required)' }).optional().or(z.literal('')),
  address: z.string().optional(),
  gender: z.enum(['men', 'women']).optional(),
});

export const OrderPlacementSchema = z.object({
  customerName: z.string().min(2, { message: 'গ্রাহকের নাম আবশ্যক' }),
  customerPhone: z.string().min(11, { message: 'সঠিক ফোন নম্বর আবশ্যক' }),
  pickupAddress: z.object({
    fullName: z.string().min(2, { message: 'নাম আবশ্যক' }),
    phone: z.string().min(11, { message: 'ফোন নম্বর আবশ্যক' }),
    division: z.string().min(1, { message: 'বিভাগ নির্বাচন করুন' }),
    area: z.string().min(1, { message: 'এলাকা নির্বাচন করুন' }),
    streetAddress: z.string().min(3, { message: 'বিস্তারিত ঠিকানা দিন' }),
    apartmentFloor: z.string().optional(),
    pickupDate: z.string().optional(),
    pickupTimeSlot: z.string().optional(),
  }),
  garment: z.object({
    id: z.string(),
    nameEn: z.string(),
    basePrice: z.number(),
  }),
  grandTotal: z.number().positive({ message: 'মোট টাকার পরিমাণ সঠিক নয়' }),
  paymentMethod: z.string().default('cod'),
}).passthrough();

// ==========================================
// 4. SECURITY HEADERS MIDDLEWARE
// ==========================================
export function securityHeadersMiddleware(_req: Request, res: Response, next: NextFunction) {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Clickjacking defense
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https: wss:; frame-src 'self' https:;"
  );
  // HSTS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
}
