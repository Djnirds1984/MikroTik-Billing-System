import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Users } from './components/Users';
import { Plans } from './components/Plans';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { RouterProvider, useRouter } from './contexts/RouterContext';
import { RouterManagementProvider } from './contexts/RouterManagementContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { AuthLayout } from './components/auth/AuthLayout';

const MainApp: React.FC = () => {
  const { route } = useRouter();

  const renderContent = () => {
    switch (route) {
      case 'dashboard': return <Dashboard />;
      case 'users': return <Users />;
      case 'plans': return <Plans />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex bg-background text-text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-background">
        <Header />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const AuthFlow: React.FC = () => {
  const { route } = useRouter();

  const renderAuthContent = () => {
    switch(route) {
      case 'login': return <Login />;
      case 'register': return <Register />;
      case 'forgot-password': return <ForgotPassword />;
      default: return <Login />;
    }
  }

  return <AuthLayout>{renderAuthContent()}</AuthLayout>;
}


const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background">
        <p className="text-text-primary">Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <MainApp /> : <AuthFlow />;
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterManagementProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </RouterManagementProvider>
    </AuthProvider>
  );
};

export default App;