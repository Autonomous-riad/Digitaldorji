export type UserRole = 'customer' | 'admin' | 'staff';

export interface UserPermissions {
  canFollowUpOrders: boolean;
  canManageCustomizations: boolean;
  canManageCatalog: boolean;
  canManageStaff: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address: string;
  city: string;
  gender: 'men' | 'women';
  avatar?: string;
  createdAt: string;
  active?: boolean;
  title?: string;
  permissions?: UserPermissions;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
}
