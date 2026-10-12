import { StaffRoleTier, PermissionModule, PermissionAction, GranularPermissions } from '../types/permissions';
import { UserPermissions, UserProfile } from '../types/auth';

/**
 * Standard Granular Permission Defaults for each role tier:
 * - admin: Unrestricted access across all modules and actions
 * - editor: Can view, create, and edit operations (orders, catalog, ready-made, customers), but cannot delete or manage staff
 * - viewer: View-only access, cannot create, edit, delete, or manage staff
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<StaffRoleTier, GranularPermissions> = {
  admin: {
    orders: { view: true, create: true, edit: true, delete: true },
    catalog: { view: true, create: true, edit: true, delete: true },
    readyMade: { view: true, create: true, edit: true, delete: true },
    customers: { view: true, create: true, edit: true, delete: true },
    staff: { view: true, create: true, edit: true, delete: true, manage: true },
    reports: { view: true, create: true, edit: true, delete: true },
    settings: { view: true, create: true, edit: true, delete: true }
  },
  editor: {
    orders: { view: true, create: true, edit: true, delete: false },
    catalog: { view: true, create: true, edit: true, delete: false },
    readyMade: { view: true, create: true, edit: true, delete: false },
    customers: { view: true, create: true, edit: true, delete: false },
    staff: { view: true, create: false, edit: false, delete: false, manage: false },
    reports: { view: true, create: false, edit: false, delete: false },
    settings: { view: true, create: false, edit: false, delete: false }
  },
  viewer: {
    orders: { view: true, create: false, edit: false, delete: false },
    catalog: { view: true, create: false, edit: false, delete: false },
    readyMade: { view: true, create: false, edit: false, delete: false },
    customers: { view: true, create: false, edit: false, delete: false },
    staff: { view: false, create: false, edit: false, delete: false, manage: false },
    reports: { view: true, create: false, edit: false, delete: false },
    settings: { view: false, create: false, edit: false, delete: false }
  }
};

/**
 * Build complete UserPermissions object based on role tier and optional overrides
 */
export function buildUserPermissions(
  roleTier: StaffRoleTier,
  customModules?: Partial<GranularPermissions>
): UserPermissions {
  const baseDefaults = DEFAULT_ROLE_PERMISSIONS[roleTier];
  const mergedModules = {
    orders: { ...baseDefaults.orders, ...(customModules?.orders || {}) },
    catalog: { ...baseDefaults.catalog, ...(customModules?.catalog || {}) },
    readyMade: { ...baseDefaults.readyMade, ...(customModules?.readyMade || {}) },
    customers: { ...baseDefaults.customers, ...(customModules?.customers || {}) },
    staff: { ...baseDefaults.staff, ...(customModules?.staff || {}) },
    reports: { ...baseDefaults.reports, ...(customModules?.reports || {}) },
    settings: { ...baseDefaults.settings, ...(customModules?.settings || {}) }
  };

  return {
    staffRole: roleTier,
    canFollowUpOrders: mergedModules.orders.edit,
    canManageCustomizations: mergedModules.catalog.edit,
    canManageCatalog: mergedModules.catalog.create || mergedModules.catalog.edit,
    canManageStaff: mergedModules.staff.manage || roleTier === 'admin',
    modules: mergedModules
  };
}

/**
 * Determine the effective role tier of a user (admin, editor, or viewer)
 */
export function getStaffRoleTier(user: Partial<UserProfile> | null | undefined): StaffRoleTier {
  if (!user) return 'viewer';
  if (user.role === 'admin') return 'admin';
  if (user.permissions?.staffRole) return user.permissions.staffRole;
  if (user.permissions?.canManageStaff) return 'admin';
  if (
    user.permissions?.canFollowUpOrders !== false ||
    user.permissions?.canManageCustomizations ||
    user.permissions?.canManageCatalog
  ) {
    return 'editor';
  }
  return 'viewer';
}

/**
 * Check if a user has a specific granular permission for a module and action
 */
export function hasPermission(
  user: Partial<UserProfile> | null | undefined,
  module: PermissionModule,
  action: PermissionAction
): boolean {
  if (!user) return false;
  if (user.role === 'customer') return false;

  // Primary super-admin check
  if (user.role === 'admin') return true;

  const roleTier = getStaffRoleTier(user);
  if (roleTier === 'admin') return true;

  // Check explicit module override if present on user profile
  const userModules: any = user.permissions?.modules;
  if (userModules && userModules[module] && userModules[module][action] !== undefined) {
    return Boolean(userModules[module][action]);
  }

  // Fallback to legacy permission flags if module matches
  if (module === 'orders' && (action === 'edit' || action === 'create')) {
    if (user.permissions?.canFollowUpOrders === false) return false;
    return true;
  }
  if (module === 'catalog' && (action === 'edit' || action === 'create')) {
    if (user.permissions?.canManageCatalog === false && user.permissions?.canManageCustomizations === false) {
      return false;
    }
  }
  if (module === 'staff' && (action === 'manage' || action === 'create' || action === 'delete' || action === 'edit')) {
    return Boolean(user.permissions?.canManageStaff);
  }

  // Fallback to standard role tier defaults
  const tierDefaults = DEFAULT_ROLE_PERMISSIONS[roleTier];
  const modDefaults: any = tierDefaults[module];
  if (modDefaults && modDefaults[action] !== undefined) {
    return Boolean(modDefaults[action]);
  }

  // Default secure fallback: deny
  return false;
}

/**
 * Route protection mapping
 */
export function canAccessRoute(
  user: Partial<UserProfile> | null | undefined,
  path: string
): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;

  const cleanPath = path.split('?')[0].replace(/\/+$/, '');

  if (cleanPath === '/admin' || cleanPath === '/admin/dashboard') {
    return hasPermission(user, 'reports', 'view') || hasPermission(user, 'orders', 'view');
  }
  if (cleanPath.startsWith('/admin/orders')) {
    return hasPermission(user, 'orders', 'view');
  }
  if (cleanPath.startsWith('/admin/ready-made')) {
    return hasPermission(user, 'readyMade', 'view');
  }
  if (cleanPath.startsWith('/admin/customers')) {
    return hasPermission(user, 'customers', 'view');
  }
  if (cleanPath.startsWith('/admin/staff') || cleanPath.startsWith('/admin/users')) {
    return hasPermission(user, 'staff', 'view');
  }
  if (cleanPath.startsWith('/admin/products') || cleanPath.startsWith('/admin/catalog')) {
    return hasPermission(user, 'catalog', 'view');
  }
  if (cleanPath.startsWith('/admin/reports')) {
    return hasPermission(user, 'reports', 'view');
  }
  if (cleanPath.startsWith('/admin/settings') || cleanPath.startsWith('/admin/database')) {
    return hasPermission(user, 'settings', 'view');
  }

  // Allow sub-routes that relate to production / delivery / pickups if order access is allowed
  if (
    cleanPath.startsWith('/admin/production') ||
    cleanPath.startsWith('/admin/delivery') ||
    cleanPath.startsWith('/admin/pickups') ||
    cleanPath.startsWith('/admin/measurements') ||
    cleanPath.startsWith('/admin/payments')
  ) {
    return hasPermission(user, 'orders', 'view');
  }

  return true;
}
