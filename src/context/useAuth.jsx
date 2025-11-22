'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { apiMe, apiLogin, apiLogout, apiRegister } from '@/lib/clientAuth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        apiMe().then((res) => {
            if (!mounted) return;
            setUser(res.user || null);
            setLoading(false);
        }).catch(() => setLoading(false));
        return () => (mounted = false);
    }, []);

    const login = async (payload) => {
        const res = await apiLogin(payload);
        if (res.user) setUser(res.user);
        return res;
    };

    const register = async (payload) => {
        const res = await apiRegister(payload);
        if (res.user) setUser(res.user);
        return res;
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
