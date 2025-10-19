import React from 'react';
import { LogoIcon } from '../icons/LogoIcon';

export const AuthLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center items-center mb-6">
                    <LogoIcon className="w-10 h-10 text-primary" />
                    <h1 className="text-2xl font-bold ml-3 text-text-primary">AdminPanel</h1>
                </div>
                <div className="bg-card p-8 rounded-xl border border-border shadow-lg">
                    {children}
                </div>
            </div>
        </div>
    );
};