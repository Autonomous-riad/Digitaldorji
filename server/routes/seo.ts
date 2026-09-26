import { Router, Request, Response } from 'express';
import { db } from '../db';

export const seoRouter = Router();

function getBaseUrl(req: Request): string {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

/**
 * GET /sitemap.xml
 * Generates XML Sitemap including all pages, categories, and garment styles
 */
seoRouter.get('/sitemap.xml', (req: Request, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const currentDate = new Date().toISOString().split('T')[0];

  // Static core routes
  const staticRoutes = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/catalog`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/fabric-catalog`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/ready-made`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/track-orders`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/track`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/account`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/legal/terms`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/legal/privacy`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/legal/refund`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/legal/shipping`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/about`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${baseUrl}/contact`, priority: '0.5', changefreq: 'monthly' },
  ];

  // Dynamic garment catalog routes
  const garments = db.getGarmentsCatalog();
  const garmentRoutes = garments.map((g: any) => ({
    loc: `${baseUrl}/catalog`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  // Dynamic ready-made products routes
  const readyMadeProducts = db.getReadyMadeProducts().filter(p => p.status === 'published');
  const productRoutes = readyMadeProducts.map(p => ({
    loc: `${baseUrl}/ready-made/${p.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  const allUrls = [...staticRoutes, ...garmentRoutes, ...productRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

/**
 * GET /robots.txt
 */
seoRouter.get('/robots.txt', (req: Request, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/*

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain');
  res.send(robots);
});
