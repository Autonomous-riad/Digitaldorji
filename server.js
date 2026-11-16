import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Ensure production mode when launched via the root entry file on Hostinger / Node.js hosting
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compiledServerPath = path.join(__dirname, 'dist', 'server.cjs');

if (existsSync(compiledServerPath)) {
  const require = createRequire(import.meta.url);
  require(compiledServerPath);
} else {
  await import('./server.ts');
}
