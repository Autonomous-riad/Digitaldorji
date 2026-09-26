// Hostinger Node.js Application Entry Point
// hPanel Node.js Application Manager supports server.js or index.js as the startup file.
import { createRequire } from 'module';
import { existsSync } from 'fs';
import { resolve } from 'path';

const require = createRequire(import.meta.url);
const distServer = resolve(process.cwd(), 'dist/server.cjs');

if (existsSync(distServer)) {
  require(distServer);
} else {
  console.log('Production bundle not detected. Attempting to load compiled server...');
  try {
    require(distServer);
  } catch (err) {
    console.error('Hostinger Startup Error: Please make sure "npm run build" has completed.', err);
  }
}
