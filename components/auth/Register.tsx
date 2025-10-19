import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from '../../contexts/RouterContext';

export const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [tenantName, setTenantName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const { setRoute } = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await register(name, email, password, tenantName);
            // App will redirect
        } catch (err: any) {
            setError(err.message || 'Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <h2 className="text-xl font-bold text-center text-text-primary mb-1">Create an Account</h2>
            <p className="text-center text-sm text-text-secondary mb-6">Start managing your routers today.</p>
            {error && <p className="bg-red-500/10 text-red-500 text-sm text-center p-3 rounded-lg mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                    <label htmlFor="tenantName" className="block text-sm font-medium text-text-secondary mb-1">Organization Name</label>
                    <input type="text" id="tenantName" value={tenantName} onChange={(e) => setTenantName(e.target.value)} required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-primary/50"
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
            <p className="text-center text-sm text-text-secondary mt-6">
                Already have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setRoute('login'); }} className="font-medium text-primary hover:underline">
                    Sign In
                </a>
            </p>
        </div>
    );
};