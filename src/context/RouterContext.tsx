import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RouterContextType {
  currentPath: string;
  search: string;
  navigate: (path: string, options?: { replace?: boolean; scroll?: boolean }) => void;
  isAdminRoute: boolean;
  isCustomerRoute: boolean;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [search, setSearch] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.search || '';
    }
    return '';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearch(window.location.search || '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, options?: { replace?: boolean; scroll?: boolean }) => {
    if (typeof window !== 'undefined') {
      if (options?.replace) {
        window.history.replaceState({}, '', path);
      } else {
        window.history.pushState({}, '', path);
      }
      
      const cleanPath = path.split('?')[0].split('#')[0] || '/';
      const searchPart = path.includes('?') ? '?' + path.split('?')[1].split('#')[0] : '';
      setCurrentPath(cleanPath);
      setSearch(searchPart);

      if (options?.scroll !== false) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const isAdminRoute = currentPath.startsWith('/admin');
  const isCustomerRoute = currentPath.startsWith('/customer');

  return (
    <RouterContext.Provider value={{ currentPath, search, navigate, isAdminRoute, isCustomerRoute }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

/**
 * Declarative redirect component that invokes navigation inside useEffect,
 * strictly preventing "Cannot update a component while rendering a different component" errors.
 */
export const Navigate: React.FC<{ to: string; replace?: boolean }> = ({ to, replace = true }) => {
  const { navigate } = useRouter();

  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace, navigate]);

  return null;
};
