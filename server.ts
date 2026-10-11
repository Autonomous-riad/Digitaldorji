import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { authRouter } from './server/routes/auth';
import { customerRouter } from './server/routes/customer';
import { adminRouter } from './server/routes/admin';
import { ordersRouter } from './server/routes/orders';
import { schemaRouter } from './server/routes/schema';
import { paymentRouter } from './server/routes/payment';
import { uploadRouter } from './server/routes/upload';
import { seoRouter } from './server/routes/seo';
import { realtimeRouter } from './server/routes/realtime';
import readyMadeRouter from './server/routes/readyMade';
import { db } from './server/db';
import {
  securityHeadersMiddleware,
  sanitizationMiddleware,
  loginRateLimiter,
  orderPlacementRateLimiter,
} from './server/lib/security';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Enable trust proxy for Hostinger/LiteSpeed/Nginx reverse proxies
  app.set('trust proxy', 1);

  // Security Headers
  app.use(securityHeadersMiddleware);

  // Body parsers with size limit (protects against DOS payload attacks)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Input Sanitization (XSS and script injection defense)
  app.use(sanitizationMiddleware);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Digital Dorji Bespoke Tailoring Atelier API',
      version: '2.0.0-production',
      timestamp: new Date().toISOString()
    });
  });

  // Public Catalog Endpoints (Dynamic databases unified with Admin dashboard saves)
  app.get('/api/catalog/garments', (req, res) => {
    res.json({ garments: db.getGarmentsCatalog() });
  });

  app.get('/api/catalog/fabrics', (req, res) => {
    res.json({ fabrics: db.getFabricsCatalog() });
  });

  // SEO Static and Dynamic Routes (sitemap.xml and robots.txt)
  app.use('/', seoRouter);

  // Rate-Limited Sensitive API Routes
  app.use('/api/auth/login', loginRateLimiter);
  app.use('/api/auth/admin-login', loginRateLimiter);
  app.use('/api/auth', authRouter);

  app.use('/api/orders', ordersRouter);
  app.use('/api/payment', paymentRouter);
  app.use('/api/customer', customerRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/schema', schemaRouter);
  app.use('/api/upload', uploadRouter);
  app.use('/api/realtime', realtimeRouter);
  app.use('/api/ready-made', readyMadeRouter);

  // 404 Handler for undefined API routes - MUST return JSON 404, never index.html!
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.path}`,
      error: 'API_ENDPOINT_NOT_FOUND'
    });
  });

  // Global Error Handler for API routes - guarantees application/json response on errors
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }
    console.error('Server error:', err);
    if (req.path.startsWith('/api/')) {
      return res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error',
        code: err.code || 'INTERNAL_ERROR'
      });
    }
    next(err);
  });

  // Serve static files from public directory
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Determine if running in production mode (or compiled bundle)
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (typeof __filename !== 'undefined' && __filename.includes('dist'));

  // Vite middleware in development or static serve in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digital Dorji server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
