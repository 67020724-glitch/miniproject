'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsReady(true);
            }
        });

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsReady(true);
            }
        };
        checkSession();

        return () => subscription.unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError(t('passwordMinLength'));
            return;
        }

        if (password !== confirmPassword) {
            setError(t('passwordMismatch'));
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (err: any) {
            setError(err.message || t('resetPasswordError'));
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400";

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ background: 'var(--background)' }}
        >
            <div className="w-full max-w-md">
                <div
                    className="rounded-2xl p-8 shadow-lg"
                    style={{
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                    }}
                >
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'var(--hover-bg)' }}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-primary)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
                        {t('setNewPassword')}
                    </h1>
                    <p className="text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
                        {t('setNewPasswordSubtitle')}
                    </p>

                    {!isReady && !success && (
                        <div className="text-center py-8">
                            <div
                                className="w-8 h-8 border-4 rounded-full animate-spin mx-auto mb-4"
                                style={{ borderColor: 'var(--card-border)', borderTopColor: 'var(--text-primary)' }}
                            />
                            <p style={{ color: 'var(--text-secondary)' }}>{t('verifyingLink')}</p>
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-6">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
                            >
                                <svg className="w-8 h-8" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                {t('passwordResetSuccess')}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{t('redirectingHome')}</p>
                        </div>
                    ) : isReady && (
                        <>
                            {error && (
                                <div
                                    className="mb-4 p-3 rounded-xl text-sm flex items-center gap-2"
                                    style={{
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        color: '#ef4444',
                                    }}
                                >
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                                        {t('newPasswordLabel')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                            className={inputClass}
                                            style={{
                                                backgroundColor: 'var(--input-bg)',
                                                border: '1px solid var(--input-border)',
                                                color: 'var(--text-primary)',
                                                paddingRight: '44px',
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
                                            style={{ color: 'var(--text-muted)' }}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.11 6.11m3.768 3.768L6.11 6.11m0 0L3 3m3.11 3.11l1.768 1.768M21 21l-3.16-3.16m0 0a9.953 9.953 0 01-3.715 1.335M17.84 17.84L21 21m-3.16-3.16l-1.768-1.768" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                                        {t('confirmNewPasswordLabel')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                            className={inputClass}
                                            style={{
                                                backgroundColor: 'var(--input-bg)',
                                                border: '1px solid var(--input-border)',
                                                color: 'var(--text-primary)',
                                                paddingRight: '44px',
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
                                            style={{ color: 'var(--text-muted)' }}
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.11 6.11m3.768 3.768L6.11 6.11m0 0L3 3m3.11 3.11l1.768 1.768M21 21l-3.16-3.16m0 0a9.953 9.953 0 01-3.715 1.335M17.84 17.84L21 21m-3.16-3.16l-1.768-1.768" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor: 'var(--active-bg)',
                                        color: 'var(--active-text)',
                                    }}
                                    onMouseEnter={e => { if (!isLoading) e.currentTarget.style.opacity = '0.85'; }}
                                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                                >
                                    {isLoading ? t('processing') : t('resetPasswordButton')}
                                </button>
                            </form>
                        </>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.push('/')}
                            className="text-sm hover:underline transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            ← {t('backToHome')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
