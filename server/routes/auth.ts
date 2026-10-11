import { Router, Request, Response } from 'express';
import { db, User } from '../db';
import { createSession, revokeSession, extractToken, requireAuth, AuthenticatedRequest } from '../auth';

export const authRouter = Router();

// Customer or Universal Login
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.getData().users.find(
    u => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = createSession(user);
  const { password: _, ...safeUser } = user;

  res.json({
    message: 'Login successful',
    token,
    user: safeUser
  });
});

// Dedicated Shop Master / Admin / Staff Login Handler
export const handleAdminLogin = (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed. Use POST for authentication.',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  const email = req.body?.email || req.body?.username;
  const password = req.body?.password;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Atelier email and password are required',
      code: 'MISSING_CREDENTIALS'
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = db.getData().users.find(
    u => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      error: 'Invalid Atelier credentials',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Deactivated account check
  if (user.active === false) {
    return res.status(403).json({
      error: 'This account has been deactivated. Please contact the Shop Master Administrator.',
      code: 'ACCOUNT_DEACTIVATED'
    });
  }

  // Server-side check: Role MUST be admin or staff (Customers are strictly forbidden)
  if (user.role !== 'admin' && user.role !== 'staff') {
    return res.status(403).json({
      error: 'Access Denied: Customer accounts cannot access the Master Atelier workshop portal. Please use the Customer Login or guest checkout on the storefront.',
      code: 'CUSTOMER_CANNOT_ACCESS_ADMIN'
    });
  }

  const token = createSession(user);
  const { password: _, ...safeUser } = user;

  res.json({
    message: user.role === 'admin' ? 'Shop Master authenticated successfully' : 'Workshop Staff authenticated successfully',
    token,
    user: safeUser,
    role: user.role,
    isAdmin: user.role === 'admin',
    isStaff: user.role === 'staff'
  });
};

authRouter.post('/admin-login', handleAdminLogin);
authRouter.all('/admin-login', handleAdminLogin);

// Customer Registration
authRouter.post('/register', (req: Request, res: Response) => {
  const { name, email, password, phone, address, gender } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.getData().users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser: User = {
    id: 'usr-cust-' + Date.now().toString(36),
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'customer', // Always customer on public registration
    phone: phone || '',
    address: address || '',
    city: 'Dhaka',
    gender: gender === 'women' ? 'women' : 'men',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  };

  db.mutate(data => {
    data.users.push(newUser);
  });

  const token = createSession(newUser);
  const { password: _, ...safeUser } = newUser;

  res.status(201).json({
    message: 'Customer account created successfully',
    token,
    user: safeUser
  });
});

// Get currently authenticated user
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { password: _, ...safeUser } = req.user;
  res.json({
    user: safeUser,
    role: safeUser.role,
    isAdmin: safeUser.role === 'admin',
    isStaff: safeUser.role === 'staff',
    isStaffOrAdmin: safeUser.role === 'admin' || safeUser.role === 'staff'
  });
});

// Verify Admin or Staff Workshop Session on the server side
authRouter.get('/verify-admin', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'staff')) {
    return res.status(403).json({
      authorized: false,
      error: 'Not authorized: Requires Shop Master Admin or Workshop Staff privileges'
    });
  }
  const { password: _, ...safeUser } = req.user;
  res.json({
    authorized: true,
    user: safeUser,
    role: safeUser.role,
    isAdmin: safeUser.role === 'admin',
    isStaff: safeUser.role === 'staff'
  });
});

// Logout
authRouter.post('/logout', (req: Request, res: Response) => {
  const token = extractToken(req);
  if (token) {
    revokeSession(token);
  }
  res.json({ message: 'Logged out successfully' });
});
