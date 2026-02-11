/**
 * WordPress Role-Based Access Control (RBAC) Utilities
 * 
 * Maps WordPress user roles to application permissions.
 * WordPress default roles: administrator, shop_manager, editor, author, 
 * contributor, subscriber, customer
 */

export interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
  roles?: string[];
}

/**
 * Check if user has administrator privileges
 * Includes both WordPress Administrator and WooCommerce Shop Manager roles
 */
export function isAdmin(user: User | null | undefined): boolean {
  if (!user?.roles) return false;
  return user.roles.includes('administrator') || user.roles.includes('shop_manager');
}

/**
 * Check if user has customer role
 */
export function isCustomer(user: User | null | undefined): boolean {
  if (!user?.roles) return false;
  return user.roles.includes('customer');
}

/**
 * Check if user has any of the specified roles
 */
export function hasRole(user: User | null | undefined, roles: string[]): boolean {
  if (!user?.roles) return false;
  return roles.some(role => user.roles!.includes(role));
}

/**
 * Check if user is authenticated (has any role)
 */
export function isAuthenticated(user: User | null | undefined): boolean {
  return !!user && !!user.roles && user.roles.length > 0;
}

/**
 * Get user's primary role (first role in the array)
 * WordPress typically assigns one primary role per user
 */
export function getPrimaryRole(user: User | null | undefined): string | null {
  if (!user?.roles || user.roles.length === 0) return null;
  return user.roles[0];
}

/**
 * Check if user has permission for a specific action
 * This can be extended with more granular permission logic
 */
export function hasPermission(
  user: User | null | undefined,
  permission: 'view_admin' | 'manage_orders' | 'manage_products' | 'view_analytics'
): boolean {
  if (!user?.roles) return false;

  // Map permissions to roles
  const permissionMap: Record<string, string[]> = {
    view_admin: ['administrator', 'shop_manager'],
    manage_orders: ['administrator', 'shop_manager'],
    manage_products: ['administrator', 'shop_manager'],
    view_analytics: ['administrator', 'shop_manager'],
  };

  const allowedRoles = permissionMap[permission] || [];
  return hasRole(user, allowedRoles);
}
