"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../lib/api";

interface User {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    role: "CITIZEN" | "OFFICIAL" | "ADMIN";
    department_id: string | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string, phone?: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "lokapp_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user from stored token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (storedToken) {
            setToken(storedToken);
            authApi
                .getMe()
                .then((data) => {
                    setUser(data.user);
                })
                .catch(() => {
                    // Token expired or invalid
                    localStorage.removeItem(TOKEN_KEY);
                    setToken(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const data = await authApi.login({ email, password });
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
    }, []);

    const signup = useCallback(async (email: string, password: string, name: string, phone?: string) => {
        const data = await authApi.signup({ email, password, name, phone });
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                signup,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
