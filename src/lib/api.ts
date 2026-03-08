const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiOptions {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
}

async function apiFetch<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    // Attach JWT token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('lokapp_token') : null;
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE}${endpoint}`, config);

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
    }

    return data as T;
}

// ============================================
// Auth API
// ============================================

export const authApi = {
    signup: (data: { email: string; password: string; name: string; phone?: string }) =>
        apiFetch('/auth/signup', { method: 'POST', body: data }),

    login: (data: { email: string; password: string }) =>
        apiFetch('/auth/login', { method: 'POST', body: data }),

    getMe: () =>
        apiFetch('/auth/me'),

    updateMe: (data: { name?: string; phone?: string }) =>
        apiFetch('/auth/me', { method: 'PUT', body: data }),
};

// ============================================
// Reports API (Phase 2)
// ============================================

export const reportsApi = {
    // Will be filled in Phase 2
};

export default apiFetch;
