import React from 'react';
import { User } from '../types';
import { useRouterManagement } from '../contexts/RouterManagementContext';

// Fix: Corrected mock user data to align with the User type. IDs are now strings and a tenantId is included.
const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', lastLogin: '2023-10-27 10:00 AM', tenantId: 'tenant-1' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor', status: 'Active', lastLogin: '2023-10-27 09:45 AM', tenantId: 'tenant-1' },
  { id: '3', name: 'Peter Jones', email: 'peter.jones@example.com', role: 'Viewer', status: 'Inactive', lastLogin: '2023-10-25 03:12 PM', tenantId: 'tenant-1' },
  { id: '4', name: 'Mary Johnson', email: 'mary.j@example.com', role: 'Editor', status: 'Active', lastLogin: '2023-10-26 08:30 PM', tenantId: 'tenant-1' },
];

export const Users: React.FC = () => {
  const { activeRouter } = useRouterManagement();

  if (!activeRouter) {
    return (
      <div className="text-center py-20 bg-card rounded-xl border border-border">
          <h2 className="text-2xl font-bold text-text-primary">No Router Selected</h2>
          <p className="text-text-secondary mt-2">Please select a router to manage its users.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Users for {activeRouter.name}</h2>
          <button className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm">Add User</button>
      </div>
      <table className="w-full text-sm text-left text-text-secondary">
        <thead className="text-xs text-text-secondary uppercase bg-card">
          <tr>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Role</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Last Login</th>
            <th scope="col" className="px-6 py-3"><span className="sr-only">Edit</span></th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map(user => (
            <tr key={user.id} className="border-b border-border hover:bg-muted">
              <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                {user.name}
                <div className="text-xs text-text-secondary">{user.email}</div>
              </th>
              <td className="px-6 py-4">{user.role}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4">{user.lastLogin}</td>
              <td className="px-6 py-4 text-right">
                <a href="#" className="font-medium text-primary hover:underline">Edit</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
