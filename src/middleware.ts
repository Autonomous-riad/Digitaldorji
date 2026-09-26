/**
 * Digital Dorji Route Protection & Middleware
 * Protects `/account`, `/customer/*`, and `/admin/*` routes.
 * Redirects unauthenticated users to `/login` and role-guards admin vs customer domains.
 */

export interface AuthSessionState {
  isAuthenticated: boolean;
  role: 'customer' | 'admin' | 'staff' | null;
  token?: string | null;
}

export function evaluateRouteProtection(pathname: string, session: AuthSessionState): {
  authorized: boolean;
  redirectTo?: string;
} {
  // Public routes: Storefront, Legal, Public tracking, Login/Signup
  const isPublicRoute = 
    pathname === '/' ||
    pathname === '/catalog' ||
    pathname === '/fabric-catalog' ||
    pathname === '/customize' ||
    pathname === '/track-orders' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/privacy-policy' ||
    pathname === '/terms' ||
    pathname === '/refund-policy' ||
    pathname === '/shipping-policy' ||
    pathname === '/about' ||
    pathname === '/contact';

  // 1. Admin Routes protection (/admin, /admin/*)
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (pathname === '/admin/login') {
      return { authorized: true };
    }
    if (!session.isAuthenticated) {
      return { authorized: false, redirectTo: '/admin/login' };
    }
    if (session.role !== 'admin' && session.role !== 'staff') {
      return { authorized: false, redirectTo: '/admin/login' };
    }
    return { authorized: true };
  }

  // 2. Customer Account Routes protection (/account, /customer/*, /dashboard)
  if (pathname === '/account' || pathname === '/dashboard' || pathname.startsWith('/customer/')) {
    if (!session.isAuthenticated) {
      return { authorized: false, redirectTo: '/login' };
    }
    return { authorized: true };
  }

  // 3. Login/Signup redirect if already authenticated
  if (pathname === '/login' || pathname === '/signup') {
    if (session.isAuthenticated) {
      const destination = (session.role === 'admin' || session.role === 'staff') ? '/admin' : '/account';
      return { authorized: false, redirectTo: destination };
    }
  }

  return { authorized: true };
}
