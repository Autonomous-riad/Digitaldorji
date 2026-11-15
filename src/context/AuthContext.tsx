import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types/auth';
import { authApi, getStoredToken, setStoredToken } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isStaffOrAdmin: boolean;
  isCustomer: boolean;
  isLoggedInCustomer: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  adminLogin: (email: string, password: string) => Promise<UserProfile>;
  sendPhoneOtp: (phone: string) => Promise<{ success: boolean; message?: string }>;
  verifyPhoneOtp: (phone: string, token: string, name?: string) => Promise<UserProfile>;
  register: (data: { name: string; email: string; password: string; phone?: string; address?: string; city?: string; gender?: string }) => Promise<UserProfile>;
  updateProfile: (data: { name?: string; phone?: string; email?: string; address?: string; city?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  verifyAdminSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      setUser(res.user);
      setToken(currentToken);
    } catch (err) {
      console.warn('Session expired or invalid:', err);
      setStoredToken(null);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const sendPhoneOtp = async (phone: string): Promise<{ success: boolean; message?: string }> => {
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('880')) {
        formattedPhone = '+' + formattedPhone;
      } else if (formattedPhone.startsWith('01')) {
        formattedPhone = '+88' + formattedPhone;
      } else {
        formattedPhone = '+880' + formattedPhone;
      }
    }
    return { success: true, message: `OTP sent to ${formattedPhone} (Demo code: 123456)` };
  };

  const verifyPhoneOtp = async (phone: string, _otpToken: string, customerName?: string): Promise<UserProfile> => {
    setIsLoading(true);
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('880')) formattedPhone = '+' + formattedPhone;
      else if (formattedPhone.startsWith('01')) formattedPhone = '+88' + formattedPhone;
      else formattedPhone = '+880' + formattedPhone;
    }

    const fallbackId = 'cust_' + Math.random().toString(36).substring(2, 9);
    const fallbackName = customerName || `Client (${formattedPhone.slice(-4)})`;
    const fallbackUser: UserProfile = {
      id: fallbackId,
      name: fallbackName,
      email: `${formattedPhone.replace(/\D/g, '')}@digitaldorji.client`,
      role: 'customer',
      phone: formattedPhone,
      address: 'Dhaka Metro',
      city: 'Dhaka',
      gender: 'men',
      createdAt: new Date().toISOString()
    };

    const sessionToken = 'sess_otp_' + Date.now();
    setStoredToken(sessionToken);
    setToken(sessionToken);
    setUser(fallbackUser);
    setIsLoading(false);
    return fallbackUser;
  };

  const login = async (email: string, password: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const res = await authApi.adminLogin(email, password);
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; address?: string; city?: string; gender?: string }): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { name?: string; phone?: string; email?: string; address?: string; city?: string }) => {
    if (!user) return;
    const updated = {
      ...user,
      ...data,
    };
    setUser(updated);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      setStoredToken(null);
      setToken(null);
      setUser(null);
    }
  };

  const verifyAdminSession = async (): Promise<boolean> => {
    try {
      const res = await authApi.verifyAdmin();
      return !!res.authorized;
    } catch {
      return false;
    }
  };

  const role: UserRole = user?.role || 'customer';
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';
  const isStaffOrAdmin = isAdmin || isStaff;
  const isLoggedInCustomer = isAuthenticated && user?.role === 'customer';
  const isCustomer = user?.role === 'customer' || !user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        isAdmin,
        isStaff,
        isStaffOrAdmin,
        isCustomer,
        isLoggedInCustomer,
        isLoading,
        login,
        adminLogin,
        sendPhoneOtp,
        verifyPhoneOtp,
        register,
        updateProfile,
        logout,
        refreshUser,
        verifyAdminSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
