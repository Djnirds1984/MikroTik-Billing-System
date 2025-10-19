
import React from 'react';

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative';
}

export const Card: React.FC<CardProps> = ({ title, value, icon, change, changeType }) => {
  const changeColor = changeType === 'positive' ? 'text-green-400' : 'text-red-400';
  
  return (
    <div className="bg-card p-6 rounded-xl border border-border flex flex-col justify-between hover:border-primary transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <p className="text-sm text-text-secondary font-medium">{title}</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
        </div>
        <div className="bg-primary/20 text-primary p-3 rounded-lg">
          {icon}
        </div>
      </div>
      {change && (
        <div className="flex items-center text-sm mt-4">
          <span className={changeColor}>{change}</span>
          <span className="text-text-secondary ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};
