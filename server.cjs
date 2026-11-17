// Root CommonJS entry file for Hostinger / Node.js hosting when Entry File is configured as server.cjs
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
require('./dist/server.cjs');
