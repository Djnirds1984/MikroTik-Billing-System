import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Tenant } from '../types';
import * as api from '../api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  tenant: Tenant | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, tenantName: string, securityQuestion: string, securityAnswer: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const data = await api.getCurrentUser();
        if (data) {
          setUser(data.user);
          setTenant(data.tenant);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Session check failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoggedIn();
  }, []);
  
  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    setUser(data.user);
    setTenant(data.tenant);
    setIsAuthenticated(true);
  };

  const register = async (name: string, email: string, password: string, tenantName: string, securityQuestion: string, securityAnswer: string) => {
    const data = await api.register(name, email, password, tenantName, securityQuestion, securityAnswer);
    setUser(data.user);
    setTenant(data.tenant);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setTenant(null);
    setIsAuthenticated(false);
  };


  const value = { isAuthenticated, user, tenant, isLoading, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};