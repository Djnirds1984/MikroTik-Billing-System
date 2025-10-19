export type Route = 'dashboard' | 'users' | 'plans' | 'reports' | 'settings' | 'login' | 'register' | 'forgot-password';

export interface Tenant {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  // Fix: Added optional properties to User type to support user list details.
  role?: string;
  status?: 'Active' | 'Inactive';
  lastLogin?: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

export interface Router {
  id: string;
  name: string;
  ip: string;
  username: string;
  password?: string;
  tenantId: string;
}
