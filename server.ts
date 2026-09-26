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

  app.use('/api/orders', orderPlacementRateLimiter, ordersRouter);
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

  // Dynamic XML Sitemap with actual domain and ready-made products
  app.get('/sitemap.xml', (req, res) => {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const staticRoutes = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/catalog', priority: '0.9', changefreq: 'daily' },
      { path: '/fabric-catalog', priority: '0.9', changefreq: 'daily' },
      { path: '/ready-made', priority: '1.0', changefreq: 'daily' },
      { path: '/track-orders', priority: '0.8', changefreq: 'weekly' },
      { path: '/legal/terms', priority: '0.3', changefreq: 'monthly' },
      { path: '/legal/privacy', priority: '0.3', changefreq: 'monthly' },
      { path: '/legal/refund', priority: '0.3', changefreq: 'monthly' }
    ];

    const readyMadeProducts = db.getReadyMadeProducts().filter(p => p.status === 'published');
    const productRoutes = readyMadeProducts.map(p => ({
      path: `/ready-made/${p.slug}`,
      priority: '0.8',
      changefreq: 'weekly'
    }));

    const allRoutes = [...staticRoutes, ...productRoutes];
    const today = new Date().toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${baseUrl}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // Serve static files from public directory
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Vite middleware in development or static serve in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
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
