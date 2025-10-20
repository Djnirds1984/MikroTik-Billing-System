import React, { useState } from 'react';
import { useRouter } from '../../contexts/RouterContext';
import * as api from '../../api';

type Step = 'email' | 'answer' | 'success';

export const ForgotPassword: React.FC = () => {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setRoute } = useRouter();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const data = await api.getSecurityQuestion(email);
            setSecurityQuestion(data.question);
            setStep('answer');
        } catch (err: any) {
            setError(err.message || 'Could not find a user with that email.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const data = await api.resetPassword(email, securityAnswer, newPassword);
            setSuccessMessage(data.message);
            setStep('success');
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. Please check your answer.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderEmailStep = () => (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                {isLoading ? 'Loading...' : 'Get Security Question'}
            </button>
        </form>
    );

    const renderAnswerStep = () => (
        <form onSubmit={handleResetSubmit} className="space-y-4">
             <div>
                <p className="text-sm text-text-secondary">Your security question is:</p>
                <p className="font-semibold text-text-primary mt-1">{securityQuestion}</p>
            </div>
            <div>
                <label htmlFor="securityAnswer" className="block text-sm font-medium text-text-secondary mb-1">Your Answer</label>
                <input
                    type="text"
                    id="securityAnswer"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    required
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <label htmlFor="newPassword"className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
                <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-primary/50"
            >
                {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
        </form>
    );
    
    const renderSuccessStep = () => (
         <div className="text-center">
            <p className="bg-green-500/10 text-green-400 text-sm p-3 rounded-lg">{successMessage}</p>
        </div>
    );

    const renderContent = () => {
        switch (step) {
            case 'email': return renderEmailStep();
            case 'answer': return renderAnswerStep();
            case 'success': return renderSuccessStep();
            default: return renderEmailStep();
        }
    };
    
    return (
        <div>
            <h2 className="text-xl font-bold text-center text-text-primary mb-1">Forgot Password</h2>
            <p className="text-center text-sm text-text-secondary mb-6">
                {step === 'email' && 'Enter your email to proceed.'}
                {step === 'answer' && 'Answer your security question to reset your password.'}
                {step === 'success' && 'You can now log in with your new password.'}
            </p>
            
            {error && <p className="bg-red-500/10 text-red-500 text-sm text-center p-3 rounded-lg mb-4">{error}</p>}
            
            {renderContent()}

            <p className="text-center text-sm text-text-secondary mt-6">
                <a href="#" onClick={(e) => { e.preventDefault(); setRoute('login'); }} className="font-medium text-primary hover:underline">
                    Back to Sign In
                </a>
            </p>
        </div>
    );
};
