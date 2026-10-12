import { StaffRoleTier, PermissionModule, PermissionAction, GranularPermissions } from './permissions';

export type UserRole = 'customer' | 'admin' | 'staff';
export type { StaffRoleTier, PermissionModule, PermissionAction, GranularPermissions };

export interface UserPermissions {
  // Legacy boolean flags preserved for 100% backwards compatibility
  canFollowUpOrders: boolean;
  canManageCustomizations: boolean;
  canManageCatalog: boolean;
  canManageStaff: boolean;

  // Granular role tier (admin, editor, viewer/view-only)
  staffRole?: StaffRoleTier;

  // Granular module and action permissions
  modules?: {
    orders?: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    catalog?: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    readyMade?: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    customers?: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    staff?: { view: boolean; create: boolean; edit: boolean; delete: boolean; manage?: boolean };
    reports?: { view: boolean; create?: boolean; edit?: boolean; delete?: boolean };
    settings?: { view: boolean; create?: boolean; edit?: boolean; delete?: boolean };
  };
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
