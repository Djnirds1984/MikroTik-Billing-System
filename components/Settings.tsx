import React, { useState, useEffect } from 'react';
import { useRouterManagement } from '../contexts/RouterManagementContext';
import { Router } from '../types';
import { Modal } from './Modal';

const RouterForm: React.FC<{
  onSubmit: (router: Omit<Router, 'id' | 'tenantId'> | Router) => void;
  onClose: () => void;
  initialData?: Router | null;
}> = ({ onSubmit, onClose, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [ip, setIp] = useState(initialData?.ip || '');
  const [username, setUsername] = useState(initialData?.username || '');
  const [password, setPassword] = useState(initialData?.password || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const routerData = { name, ip, username, password };
    if (initialData) {
      onSubmit({ ...initialData, ...routerData });
    } else {
      onSubmit(routerData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Router Name</label>
          <input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="ip" className="block text-sm font-medium text-text-secondary mb-1">IP Address</label>
          <input type="text" name="ip" id="ip" value={ip} onChange={e => setIp(e.target.value)} required className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">Username</label>
          <input type="text" name="username" id="username" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-text-secondary mb-1">Password</label>
          <input type="password" name="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-secondary rounded-lg border border-border hover:bg-muted">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">Save Router</button>
      </div>
    </form>
  );
};

export const Settings: React.FC = () => {
  const { routers, addRouter, updateRouter, deleteRouter, isLoading } = useRouterManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRouter, setEditingRouter] = useState<Router | null>(null);

  const openAddModal = () => {
    setEditingRouter(null);
    setIsModalOpen(true);
  };

  const openEditModal = (router: Router) => {
    setEditingRouter(router);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRouter(null);
  };

  const handleFormSubmit = async (routerData: Omit<Router, 'id' | 'tenantId'> | Router) => {
    if ('id' in routerData) {
      await updateRouter(routerData);
    } else {
      await addRouter(routerData);
    }
    closeModal();
  };
  
  const handleDelete = async (id: string) => {
      if(window.confirm('Are you sure you want to delete this router?')) {
        await deleteRouter(id);
      }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Router Settings</h2>
        <button
          onClick={openAddModal}
          className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Add Router
        </button>
      </div>
      <div className="bg-card rounded-xl border border-border">
        {isLoading ? <div className="p-10 text-center text-text-secondary">Loading routers...</div> :
         routers.length > 0 ? (
          <ul className="divide-y divide-border">
            {routers.map(router => (
              <li key={router.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-text-primary">{router.name}</p>
                  <p className="text-sm text-text-secondary">{router.ip}</p>
                </div>
                <div className="space-x-4">
                  <button onClick={() => openEditModal(router)} className="text-sm font-medium text-primary hover:underline">Edit</button>
                  <button onClick={() => handleDelete(router.id)} className="text-sm font-medium text-red-500 hover:underline">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-10 text-center">
            <p className="text-text-secondary">No routers configured. Click "Add Router" to get started.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingRouter ? 'Edit Router' : 'Add New Router'}>
        <RouterForm 
            onSubmit={handleFormSubmit}
            onClose={closeModal}
            initialData={editingRouter}
        />
      </Modal>
    </>
  );
};