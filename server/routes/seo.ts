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
    { loc: `${baseUrl}/track`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/account`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/legal/terms`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/legal/privacy`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/legal/refund`, priority: '0.3', changefreq: 'yearly' },
  ];

  // Dynamic garment routes
  const garmentIds = [
    'men-formal-shirt',
    'men-panjabi-kurta',
    'men-formal-pant',
    'men-pajama-aligarhi',
    'women-three-piece',
    'women-blouse-saree',
    'women-kurti-tunic',
    'women-anarkali-gown',
    'women-palazzo-pant',
  ];

  const garmentRoutes = garmentIds.map(id => ({
    loc: `${baseUrl}/customizer/${id}`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  const allUrls = [...staticRoutes, ...garmentRoutes];

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
