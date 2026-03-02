import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BackendUser } from '@/types/game';

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface AuthState {
    user: BackendUser | null;
    token: string | null;
    isLoading: boolean;       // true while we're reading localStorage on mount
}

interface AuthContextValue extends AuthState {
    login: (user: BackendUser, token: string) => void;
    logout: () => void;
    updateUser: (user: BackendUser) => void; // call after profile save, shop buy, etc.
}

// ── CONTEXT ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'rtr_token';
const USER_KEY = 'rtr_user';

// ── PROVIDER ──────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isLoading: true,
    });

    // On mount: restore session from localStorage
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem(TOKEN_KEY);
            const storedUser = localStorage.getItem(USER_KEY);

            if (storedToken && storedUser) {
                setState({
                    token: storedToken,
                    user: JSON.parse(storedUser) as BackendUser,
                    isLoading: false,
                });
            } else {
                setState(s => ({ ...s, isLoading: false }));
            }
        } catch {
            // Corrupted storage — clear it
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setState(s => ({ ...s, isLoading: false }));
        }
    }, []);

    // Called after successful register or login
    const login = useCallback((user: BackendUser, token: string) => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setState({ user, token, isLoading: false });
    }, []);

    // Clear session
    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setState({ user: null, token: null, isLoading: false });
    }, []);

    // Keep stored user in sync after any profile mutation
    const updateUser = useCallback((user: BackendUser) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setState(s => ({ ...s, user }));
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// ── HOOK ──────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
};