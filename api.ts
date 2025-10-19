import { User, Tenant, Router } from './types';

const API_BASE_URL = 'http://localhost:4000/api'; // Your backend server URL

const getToken = () => localStorage.getItem('mikrotik_token');

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) { // No Content
        return null;
    }

    return response.json();
};


// --- AUTH API ---

interface AuthResponse {
    token: string;
    user: User;
    tenant: Tenant;
}

export const register = async (name: string, email: string, password: string, tenantName: string): Promise<AuthResponse> => {
    const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, tenantName }),
    });
    localStorage.setItem('mikrotik_token', data.token);
    return data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('mikrotik_token', data.token);
    return data;
};

export const logout = async () => {
    localStorage.removeItem('mikrotik_token');
};

export const getCurrentUser = async (): Promise<{ user: User; tenant: Tenant } | null> => {
    const token = getToken();
    if (!token) return null;
    try {
        return await apiFetch('/auth/me');
    } catch (error) {
        console.error("Session fetch failed, logging out.", error);
        logout(); // Token is invalid or expired
        return null;
    }
};


// --- ROUTER API ---

export const getRouters = async (): Promise<Router[]> => {
    return apiFetch('/routers');
};

export const addRouter = async (routerData: Omit<Router, 'id' | 'tenantId'>): Promise<Router> => {
    return apiFetch('/routers', {
        method: 'POST',
        body: JSON.stringify(routerData),
    });
};

export const updateRouter = async (updatedRouter: Router): Promise<Router> => {
    const { id, ...data } = updatedRouter;
    return apiFetch(`/routers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

export const deleteRouter = async (id: string): Promise<void> => {
    await apiFetch(`/routers/${id}`, { method: 'DELETE' });
};
