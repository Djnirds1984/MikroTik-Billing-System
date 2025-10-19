import React, { useState, useRef, useEffect } from 'react';
import { useRouterManagement } from '../contexts/RouterManagementContext';
import { useAuth } from '../contexts/AuthContext';

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  );

const UserMenu: React.FC = () => {
    const { user, tenant, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const userInitials = user?.name.split(' ').map(n => n[0]).join('') || '?';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white">
                    {userInitials}
                </div>
                <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-text-primary">{user.name}</p>
                    <p className="text-xs text-text-secondary">{tenant?.name}</p>
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-10">
                    <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-muted"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};


export const Header: React.FC = () => {
  const { routers, activeRouter, setActiveRouterId } = useRouterManagement();
  const { tenant } = useAuth();

  return (
    <header className="flex justify-between items-center p-6 border-b border-border">
      <div>
        <h1 className="text-2xl font-bold text-text-primary capitalize">{tenant?.name || 'Admin Panel'}</h1>
        <p className="text-sm text-text-secondary">{activeRouter ? `Managing: ${activeRouter.name}` : 'Select a router to begin'}</p>
      </div>
      <div className="flex items-center space-x-6">
         <div className="relative">
            <select
                value={activeRouter?.id || ''}
                onChange={(e) => setActiveRouterId(e.target.value || null)}
                className="appearance-none bg-card border border-border rounded-lg px-4 py-2 pr-8 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <option value="">Select a Router</option>
                {routers.map(router => (
                    <option key={router.id} value={router.id}>{router.name}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
                <ChevronDownIcon />
            </div>
        </div>
        <UserMenu />
      </div>
    </header>
  );
};