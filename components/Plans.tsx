import React from 'react';
import { Plan } from '../types';
import { useRouterManagement } from '../contexts/RouterManagementContext';

const mockPlans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9,
    features: ['5 Projects', '100 GB Storage', 'Basic Analytics', 'Email Support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    features: ['Unlimited Projects', '1 TB Storage', 'Advanced Analytics', 'Priority Email Support', 'API Access'],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    features: ['All Pro Features', 'Dedicated Account Manager', '24/7 Phone Support', 'Custom Integrations'],
  },
];

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);


export const Plans: React.FC = () => {
  const { activeRouter } = useRouterManagement();

  if (!activeRouter) {
    return (
      <div className="text-center py-20 bg-card rounded-xl border border-border">
          <h2 className="text-2xl font-bold text-text-primary">No Router Selected</h2>
          <p className="text-text-secondary mt-2">Please select a router to manage its billing plans.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-text-primary">Choose Your Plan for {activeRouter.name}</h2>
        <p className="text-text-secondary mt-2">Flexible pricing for teams of all sizes.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {mockPlans.map(plan => (
          <div key={plan.id} className={`bg-card rounded-xl border ${plan.recommended ? 'border-primary' : 'border-border'} p-8 flex flex-col`}>
            {plan.recommended && (
              <div className="text-center mb-4">
                <span className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full">RECOMMENDED</span>
              </div>
            )}
            <h3 className="text-xl font-semibold text-text-primary text-center">{plan.name}</h3>
            <div className="text-center my-6">
              <span className="text-4xl font-bold text-text-primary">${plan.price}</span>
              <span className="text-text-secondary">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon />
                  <span className="ml-3 text-text-secondary">{feature}</span>
                </li>
              ))}
            </ul>
            <button className={`mt-auto w-full py-3 rounded-lg font-semibold transition-colors ${plan.recommended ? 'bg-primary text-white hover:bg-primary/90' : 'bg-muted text-text-primary hover:bg-muted/80'}`}>
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};