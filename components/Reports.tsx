import React from 'react';
import { useRouterManagement } from '../contexts/RouterManagementContext';

export const Reports: React.FC = () => {
  const { activeRouter } = useRouterManagement();

  if (!activeRouter) {
    return (
      <div className="text-center py-20 bg-card rounded-xl border border-border">
          <h2 className="text-2xl font-bold text-text-primary">No Router Selected</h2>
          <p className="text-text-secondary mt-2">Please select a router to view its reports.</p>
      </div>
    );
  }
  
  return (
    <div className="text-center py-20 bg-card rounded-xl border border-border">
      <h2 className="text-2xl font-bold text-text-primary">Reports for {activeRouter.name}</h2>
      <p className="text-text-secondary mt-2">Detailed reports and analytics will be displayed here.</p>
      <p className="text-text-secondary mt-1">This feature is currently under development.</p>
    </div>
  );
};