import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from '../../contexts/RouterContext';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { setRoute } = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await login(email, password);
            // The App component will handle the redirect automatically
        } catch (err: any) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-center text-text-primary mb-1">Welcome Back</h2>
            <p className="text-center text-sm text-text-secondary mb-6">Sign in to continue</p>
            {error && <p className="bg-red-500/10 text-red-500 text-sm text-center p-3 rounded-lg mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="text-right">
                    <a href="#" onClick={(e) => { e.preventDefault(); setRoute('forgot-password'); }} className="text-sm text-primary hover:underline">Forgot password?</a>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-primary/50"
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
            <p className="text-center text-sm text-text-secondary mt-6">
                Don't have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setRoute('register'); }} className="font-medium text-primary hover:underline">
                    Register
                </a>
            </p>
        </div>
    );
};