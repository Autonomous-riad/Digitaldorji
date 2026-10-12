import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, requireAuth } from '../auth';
import { User } from '../db';
import {
  StaffRoleTier,
  PermissionModule,
  PermissionAction,
  GranularPermissions
} from '../../src/types/permissions';
import {
  DEFAULT_ROLE_PERMISSIONS,
  getStaffRoleTier,
  hasPermission,
  buildUserPermissions
} from '../../src/utils/permissions';

export type {
  StaffRoleTier,
  PermissionModule,
  PermissionAction,
  GranularPermissions
};
export {
  DEFAULT_ROLE_PERMISSIONS,
  getStaffRoleTier,
  hasPermission,
  buildUserPermissions
};

/**
 * Express middleware to enforce granular role-based permissions on backend endpoints.
 * Returns 403 Forbidden with structured code if unauthorized.
 */
export function requirePermission(module: PermissionModule, action: PermissionAction) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    requireAuth(req, res, () => {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Shop Master Super-Admin always has full bypass
      if (user.role === 'admin') {
        return next();
      }

      // Check granular permission
      if (hasPermission(user as any, module, action)) {
        return next();
      }

      return res.status(403).json({
        error: `Permission denied: You do not have ${action.toUpperCase()} privileges for the ${module.toUpperCase()} module.`,
        code: 'PERMISSION_DENIED',
        module,
        action,
        userRole: user.role,
        userTier: getStaffRoleTier(user as any)
      });
    });
  };
}

/**
 * Enforce strict anti-self-escalation and role boundary rules
 */
export function validateStaffMutation(
  actingUser: User,
  targetUserId: string | null,
  mutationData: {
    role?: string;
    permissions?: any;
    active?: boolean;
  }
): { allowed: boolean; error?: string } {
  const isSuperAdmin = actingUser.role === 'admin';

  // 1. SELF-ESCALATION PREVENTION:
  // Staff cannot escalate their own permissions, change their own role, or toggle their own status.
  if (targetUserId && actingUser.id === targetUserId) {
    if (mutationData.role !== undefined && mutationData.role !== actingUser.role) {
      return {
        allowed: false,
        error: 'Self-escalation forbidden: You cannot change your own role.'
      };
    }

    if (mutationData.permissions !== undefined) {
      return {
        allowed: false,
        error: 'Self-escalation forbidden: You cannot alter your own permissions.'
      };
    }

    if (mutationData.active !== undefined && mutationData.active !== actingUser.active) {
      return {
        allowed: false,
        error: 'Self-escalation forbidden: You cannot alter your own active state.'
      };
    }
  }

  // 2. PRIVILEGE BOUNDARIES:
  // Non-super-admins cannot assign the 'admin' role or assign super-admin permissions to anyone
  if (!isSuperAdmin) {
    if (mutationData.role === 'admin') {
      return {
        allowed: false,
        error: 'Privilege escalation forbidden: Only an existing Shop Master Administrator can assign the Admin role.'
      };
    }

    if (mutationData.permissions?.staffRole === 'admin') {
      return {
        allowed: false,
        error: 'Privilege escalation forbidden: Only an Admin can assign Admin tier permissions.'
      };
    }

    if (mutationData.permissions?.canManageStaff === true) {
      return {
        allowed: false,
        error: 'Privilege escalation forbidden: Only an Admin can grant Staff Management permissions.'
      };
    }
  }

  return { allowed: true };
}
