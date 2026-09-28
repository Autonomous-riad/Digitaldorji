import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'staff' | 'customer';
}

/**
 * AuthGuard implements route protection middleware:
 * - /dashboard and /admin routes require login
 * - Unauthenticated users get redirected to /login
 * - Role validation ensures customers cannot access admin portal
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        // Requirement 4: Unauthenticated users get redirected to /login
        navigate('/login', { replace: true });
      } else if (requiredRole === 'admin' && user.role !== 'admin' && user.role !== 'staff') {
        // Customer tried to access admin route: redirect to /dashboard
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRole, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mb-3" />
        <p className="text-xs text-purple-950/70 font-medium">Verifying secure session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (requiredRole === 'admin' && user.role !== 'admin' && user.role !== 'staff') {
    return null;
  }

  return <>{children}</>;
};
