/**
 * Authentication utilities
 * Centralized exports for auth-related functions
 */

// Client-side role checking
export { isAdmin, isCustomer, hasRole, isAuthenticated, getPrimaryRole, hasPermission } from './roles';
export type { User } from './roles';

// Server-side auth
export { getServerAuth, getCurrentUser, requireAdmin, requireAuth } from './server';
