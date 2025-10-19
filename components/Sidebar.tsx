import React from 'react';
import { useRouter } from '../contexts/RouterContext';
import { DashboardIcon } from './icons/DashboardIcon';
import { UsersIcon } from './icons/UsersIcon';
import { PlansIcon } from './icons/PlansIcon';
import { ReportsIcon } from './icons/ReportsIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { LogoIcon } from './icons/LogoIcon';
import { Route } from '../types';

// Fix: Changed icon type to be a more specific React.ReactElement with className prop, to satisfy React.cloneElement.
const navItems: { route: Route; label: string; icon: React.ReactElement<{ className?: string }> }[] = [
  { route: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { route: 'users', label: 'Users', icon: <UsersIcon /> },
  { route: 'plans', label: 'Plans', icon: <PlansIcon /> },
  { route: 'reports', label: 'Reports', icon: <ReportsIcon /> },
  { route: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

const NavLink: React.FC<{
  route: Route;
  label: string;
  // Fix: Changed icon type to be a more specific React.ReactElement with className prop, to satisfy React.cloneElement.
  icon: React.ReactElement<{ className?: string }>;
  isActive: boolean;
  onClick: (route: Route) => void;
}> = ({ route, label, icon, isActive, onClick }) => {
  const activeClass = isActive ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-muted hover:text-text-primary';
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick(route);
      }}
      className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${activeClass}`}
    >
      {/* With the corrected icon type, React.cloneElement can safely pass the className prop. */}
      {React.cloneElement(icon, { className: "w-5 h-5" })}
      <span className="ml-4 font-medium">{label}</span>
    </a>
  );
};

export const Sidebar: React.FC = () => {
  const { route, setRoute } = useRouter();

  return (
    <div className="bg-card w-64 h-screen flex-shrink-0 border-r border-border p-6 flex flex-col">
      <div className="flex items-center mb-10">
        <LogoIcon className="w-8 h-8 text-primary" />
        <span className="text-xl font-bold ml-3 text-text-primary">AdminPanel</span>
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.route}
            {...item}
            isActive={route === item.route}
            onClick={setRoute}
          />
        ))}
      </nav>
      <div className="mt-auto">
        {/* You can add footer items here, like a user profile */}
      </div>
    </div>
  );
};
