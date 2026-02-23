'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';

interface User {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
}

type OAuthProvider = 'google' | 'github';

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
    signInWithProvider: (provider: OAuthProvider) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const extractUser = (supabaseUser: any): User => ({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name
            || supabaseUser.user_metadata?.full_name
            || supabaseUser.user_metadata?.user_name
            || supabaseUser.email?.split('@')[0]
            || 'User',
        avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
    });

    useEffect(() => {
        // Check active sessions and sets the user
        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(extractUser(session.user));
            }
            setIsInitialized(true);
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(extractUser(session.user));
            } else {
                setUser(null);
            }
            setIsInitialized(true);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string, rememberMe: boolean = true): Promise<{ success: boolean; error?: string }> => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return { success: true };
        } catch (error: any) {
            console.error('Login error:', error);
            return { success: false, error: error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
        }
    };

    const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                    },
                },
            });
            if (error) throw error;
            return { success: true };
        } catch (error: any) {
            console.error('Register error:', error);
            return { success: false, error: error.message || 'เกิดข้อผิดพลาดในการลงทะเบียน' };
        }
    };

    const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const redirectUrl = typeof window !== 'undefined'
                ? `${window.location.origin}/auth/reset-password`
                : '';

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            });
            if (error) throw error;
            return { success: true };
        } catch (error: any) {
            console.error('Forgot password error:', error);
            return { success: false, error: error.message || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน' };
        }
    };

    const signInWithProvider = async (provider: OAuthProvider): Promise<{ success: boolean; error?: string }> => {
        try {
            const redirectUrl = typeof window !== 'undefined'
                ? `${window.location.origin}/auth/callback`
                : '';

            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: redirectUrl,
                },
            });
            if (error) throw error;
            return { success: true };
        } catch (error: any) {
            console.error('OAuth error:', error);
            return { success: false, error: error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
        }
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                isLoading: !isInitialized,
                login,
                register,
                logout,
                forgotPassword,
                signInWithProvider,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
