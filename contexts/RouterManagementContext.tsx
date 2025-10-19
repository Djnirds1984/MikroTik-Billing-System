import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { Router } from '../types';
import { useAuth } from './AuthContext';
import * as api from '../api';

interface RouterManagementContextType {
  routers: Router[];
  activeRouter: Router | null;
  addRouter: (router: Omit<Router, 'id' | 'tenantId'>) => Promise<void>;
  updateRouter: (router: Router) => Promise<void>;
  deleteRouter: (id: string) => Promise<void>;
  setActiveRouterId: (id: string | null) => void;
  isLoading: boolean;
  error: string | null;
}

const RouterManagementContext = createContext<RouterManagementContextType | undefined>(undefined);

export const RouterManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [routers, setRouters] = useState<Router[]>([]);
  const [activeRouterId, setActiveRouterId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRouters = async () => {
      // Only fetch if authenticated
      if (isAuthenticated) {
        setIsLoading(true);
        setError(null);
        try {
          const fetchedRouters = await api.getRouters();
          setRouters(fetchedRouters);
          // Set active router only if one isn't already selected or the old one was deleted
          if (fetchedRouters.length > 0 && (!activeRouterId || !fetchedRouters.find(r => r.id === activeRouterId))) {
            setActiveRouterId(fetchedRouters[0].id);
          } else if (fetchedRouters.length === 0) {
              setActiveRouterId(null);
          }
        } catch (err: any) {
          setError(err.message || 'Failed to fetch routers.');
        } finally {
          setIsLoading(false);
        }
      } else {
        // Clear data on logout
        setRouters([]);
        setActiveRouterId(null);
      }
    };
    fetchRouters();
  }, [isAuthenticated]); // Re-fetch when auth state changes

  const addRouter = async (routerData: Omit<Router, 'id' | 'tenantId'>) => {
    const newRouter = await api.addRouter(routerData);
    setRouters(prev => [...prev, newRouter]);
    setActiveRouterId(newRouter.id);
  };

  const updateRouter = async (updatedRouter: Router) => {
    const router = await api.updateRouter(updatedRouter);
    setRouters(prev => prev.map(r => r.id === router.id ? router : r));
  };

  const deleteRouter = async (id: string) => {
    await api.deleteRouter(id);
    const newRouters = routers.filter(r => r.id !== id);
    setRouters(newRouters);
    if (activeRouterId === id) {
        setActiveRouterId(newRouters.length > 0 ? newRouters[0].id : null);
    }
  };

  const activeRouter = useMemo(() => {
    return routers.find(r => r.id === activeRouterId) || null;
  }, [routers, activeRouterId]);

  return (
    <RouterManagementContext.Provider value={{ routers, activeRouter, addRouter, updateRouter, deleteRouter, setActiveRouterId, isLoading, error }}>
      {children}
    </RouterManagementContext.Provider>
  );
};

export const useRouterManagement = () => {
  const context = useContext(RouterManagementContext);
  if (context === undefined) {
    throw new Error('useRouterManagement must be used within a RouterManagementProvider');
  }
  return context;
};
