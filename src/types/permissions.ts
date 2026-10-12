export type StaffRoleTier = 'admin' | 'editor' | 'viewer';

export type PermissionModule =
  | 'orders'
  | 'catalog'
  | 'readyMade'
  | 'customers'
  | 'staff'
  | 'reports'
  | 'settings';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'manage';

export interface ModuleActionPermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  manage?: boolean;
}

export interface GranularPermissions {
  orders: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  catalog: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  readyMade: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  customers: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  staff: { view: boolean; create: boolean; edit: boolean; delete: boolean; manage: boolean };
  reports: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  settings: { view: boolean; create: boolean; edit: boolean; delete: boolean };
}
