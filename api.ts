import { User, Tenant, Router } from './types';

const API_BASE_URL = 'http://localhost:4000/api'; // Your backend server URL

const getToken = () => localStorage.getItem('mikrotik_token');

type ApiOptions = RequestInit & { timeoutMs?: number };

const apiFetch = async (endpoint: string, options: ApiOptions = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeout = options.timeoutMs ? setTimeout(() => controller.abort(), options.timeoutMs) : null;

    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            signal: controller.signal,
        });
    } catch (err: any) {
        if (err?.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.');
        }
        throw err;
    } finally {
        if (timeout) clearTimeout(timeout);
    }

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

export const register = async (name: string, email: string, password: string, tenantName: string, securityQuestion: string, securityAnswer: string): Promise<AuthResponse> => {
    const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, tenantName, securityQuestion, securityAnswer }),
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
        return await apiFetch('/auth/me', { timeoutMs: 3000 });
    } catch (error) {
        console.error("Session fetch failed, logging out.", error);
        logout(); // Token is invalid or expired
        return null;
    }
};

export const getSecurityQuestion = async (email: string): Promise<{ question: string }> => {
    return apiFetch('/auth/security-question', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
};

export const resetPassword = async (email: string, securityAnswer: string, newPassword: string): Promise<{ message: string }> => {
    return apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, securityAnswer, newPassword }),
    });
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
