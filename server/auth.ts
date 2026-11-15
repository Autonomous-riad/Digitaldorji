import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db, User } from './db';

export interface Session {
  token: string;
  userId: string;
  role: 'admin' | 'staff' | 'customer';
  createdAt: number;
  expiresAt: number;
}

// In-memory active sessions store backed by persistent JSON database
const sessions = new Map<string, Session>();

// 7 days expiration in milliseconds
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;

function syncSessionsFromDb() {
  try {
    const data = db.getData();
    if (Array.isArray(data.sessions)) {
      const now = Date.now();
      for (const s of data.sessions) {
        if (s && s.token && s.expiresAt > now && !sessions.has(s.token)) {
          sessions.set(s.token, s);
        }
      }
    }
  } catch {
    // ignore initialization error
  }
}

function saveSessionsToDb() {
  try {
    const data = db.getData();
    const now = Date.now();
    data.sessions = Array.from(sessions.values()).filter((s) => s.expiresAt > now);
    db.save();
  } catch {
    // ignore write error
  }
}

export function createSession(user: User): string {
  syncSessionsFromDb();
  const token = 'db_sess_' + crypto.randomBytes(32).toString('hex');
  const session: Session = {
    token,
    userId: user.id,
    role: user.role,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL
  };
  sessions.set(token, session);
  saveSessionsToDb();
  return token;
}

export function getSession(token: string): Session | null {
  if (!token) return null;
  if (!sessions.has(token)) {
    syncSessionsFromDb();
  }
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    saveSessionsToDb();
    return null;
  }
  return session;
}

export function revokeSession(token: string) {
  sessions.delete(token);
  saveSessionsToDb();
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  sessionToken?: string;
}

// Extract bearer token from Authorization header or custom header
export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization || (req.headers['x-auth-token'] as string);
  if (!authHeader) return null;
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return authHeader.trim();
}

/**
 * Middleware: Verify user is authenticated
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required: missing token' });
  }

  const session = getSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Authentication required: invalid or expired session' });
  }

  const user = db.getData().users.find(u => u.id === session.userId);
  if (!user) {
    return res.status(401).json({ error: 'User account not found' });
  }

  req.user = user;
  req.sessionToken = token;
  next();
}

/**
 * Middleware: Verify user role is either Admin or Staff/Tailor Master
 * Customers attempting to access Workshop/Admin endpoints will receive 403 Forbidden.
 */
export function requireStaffOrAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'staff')) {
      return res.status(403).json({
        error: 'Access denied: Atelier Shop Master or Workshop Staff authorization required.',
        code: 'SHOP_ACCESS_REQUIRED'
      });
    }
    next();
  });
}

/**
 * Middleware: Verify strictly Admin role (e.g. for staff management and shop settings)
 * Staff or Customers attempting access receive 403 Forbidden.
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied: Shop Master Administrator privileges required. Workshop staff cannot modify this resource.',
        code: 'ADMIN_ONLY'
      });
    }
    next();
  });
}

/**
 * Middleware: Require Customer role
 */
export function requireCustomer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (!req.user || req.user.role !== 'customer') {
      return res.status(403).json({
        error: 'Access denied: Customer account required.',
        code: 'CUSTOMER_ACCESS_REQUIRED'
      });
    }
    next();
  });
}

/**
 * Middleware: Optional authentication
 * If a valid token is provided, populates req.user. If not, proceeds as guest without error.
 */
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return next();
  }

  const session = getSession(token);
  if (session) {
    const user = db.getData().users.find(u => u.id === session.userId);
    if (user) {
      req.user = user;
      req.sessionToken = token;
    }
  }
  next();
}
