import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Route } from '../types';
import { useAuth } from './AuthContext'; // Import useAuth to check auth state

interface RouterContextType {
  route: Route;
  setRoute: (route: Route) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Set initial route to 'login' by default. App logic will show dashboard if already authenticated.
  const [route, setRoute] = useState<Route>('login');
  
  return (
    <RouterContext.Provider value={{ route, setRoute }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};