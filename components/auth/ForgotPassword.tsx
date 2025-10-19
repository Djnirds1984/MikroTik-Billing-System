import React, { useState } from 'react';
import { useRouter } from '../../contexts/RouterContext';

export const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setRoute } = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(res => setTimeout(res, 1000));
        setMessage(`If an account with the email ${email} exists, a password reset link has been sent.`);
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-center text-text-primary mb-1">Forgot Password</h2>
            <p className="text-center text-sm text-text-secondary mb-6">Enter your email to receive a reset link.</p>
            
            {message ? (
                <p className="bg-green-500/10 text-green-400 text-sm text-center p-3 rounded-lg mb-4">{message}</p>
            ) : (
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
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-primary/50"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
            )}

            <p className="text-center text-sm text-text-secondary mt-6">
                Remembered your password?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setRoute('login'); }} className="font-medium text-primary hover:underline">
                    Sign In
                </a>
            </p>
        </div>
    );
};