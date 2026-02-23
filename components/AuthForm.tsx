'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface AuthFormProps {
    initialMode?: 'login' | 'register' | 'forgot';
    onSuccess?: () => void;
    onSwitchMode?: (mode: 'login' | 'register' | 'forgot') => void;
}

export default function AuthForm({
    initialMode = 'login',
    onSuccess,
    onSwitchMode
}: AuthFormProps) {
    const { login, register, forgotPassword, signInWithProvider } = useAuth();
    const { t } = useLanguage();
    const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [forgotEmailSent, setForgotEmailSent] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (mode === 'forgot') {
                const result = await forgotPassword(email.trim());
                if (result.success) {
                    setForgotEmailSent(true);
                } else {
                    let errMsg = result.error || t('forgotPasswordError');
                    if (errMsg.includes('rate limit')) errMsg = t('rateLimitError');
                    setError(errMsg);
                }
            } else if (mode === 'register') {
                if (password !== confirmPassword) {
                    setError(t('passwordMismatch'));
                    setIsLoading(false);
                    return;
                }
                const result = await register(name, email.trim(), password);
                if (result.success) {
                    onSuccess?.();
                } else {
                    let errMsg = result.error || 'การลงทะเบียนล้มเหลว';
                    if (errMsg.includes('already registered')) errMsg = 'อีเมลนี้ถูกใช้งานแล้ว';
                    if (errMsg.includes('invalid')) errMsg = 'อีเมลหรือรูปแบบไม่ถูกต้อง';
                    if (errMsg.includes('Password should be')) errMsg = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
                    setError(errMsg);
                }
            } else {
                const result = await login(email.trim(), password, rememberMe);
                if (result.success) {
                    onSuccess?.();
                } else {
                    let errMsg = result.error || 'การเข้าสู่ระบบล้มเหลว';
                    if (errMsg.includes('Invalid login credentials')) errMsg = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
                    if (errMsg.includes('Email not confirmed')) errMsg = 'กรุณายืนยันอีเมลก่อนเข้าใช้งาน';
                    setError(errMsg);
                }
            }
        } catch (error: any) {
            setError(error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: 'google' | 'github') => {
        setOauthLoading(provider);
        setError('');
        try {
            const result = await signInWithProvider(provider);
            if (!result.success) {
                setError(result.error || t('oauthError'));
            }
        } catch (err: any) {
            setError(err.message || t('oauthError'));
        } finally {
            setOauthLoading(null);
        }
    };

    const switchMode = (newMode: 'login' | 'register' | 'forgot') => {
        setMode(newMode);
        setError('');
        setForgotEmailSent(false);
        onSwitchMode?.(newMode);
    };

    const inputClass = "w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400";

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 rounded-xl text-sm flex items-center gap-2 bg-red-50 border border-red-100 text-red-600">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            {mode === 'forgot' && forgotEmailSent ? (
                <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-green-50">
                        <svg className="w-8 h-8" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {t('resetEmailSent')}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                        {t('resetEmailSentMessage')}
                    </p>
                    <button
                        onClick={() => switchMode('login')}
                        className="mt-6 text-sm font-medium hover:underline transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        ← {t('backToLogin')}
                    </button>
                </div>
            ) : (
                <>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                                    {t('nameLabel')}
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('namePlaceholder')}
                                    required
                                    className={inputClass}
                                    style={{
                                        backgroundColor: 'var(--input-bg)',
                                        border: '1px solid var(--input-border)',
                                        color: 'var(--text-primary)',
                                    }}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                                {t('emailLabel')}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className={inputClass}
                                style={{
                                    backgroundColor: 'var(--input-bg)',
                                    border: '1px solid var(--input-border)',
                                    color: 'var(--text-primary)',
                                }}
                            />
                        </div>

                        {mode !== 'forgot' && (
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                                    {t('passwordLabel')}
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
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.11 6.11m3.768 3.768L6.11 6.11m0 0L3 3m3.11 3.11l1.768 1.768M21 21l-3.16-3.16m0 0a9.953 9.953 0 01-3.715 1.335M17.84 17.84L21 21m-3.16-3.16l-1.768-1.768" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                                    {t('confirmPasswordLabel')}
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
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.11 6.11m3.768 3.768L6.11 6.11m0 0L3 3m3.11 3.11l1.768 1.768M21 21l-3.16-3.16m0 0a9.953 9.953 0 01-3.715 1.335M17.84 17.84L21 21m-3.16-3.16l-1.768-1.768" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {mode === 'login' && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 rounded cursor-pointer"
                                        style={{ accentColor: 'var(--active-bg)' }}
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                                        {t('rememberMe')}
                                    </label>
                                </div>
                                <button type="button" onClick={() => switchMode('forgot')} className="text-sm font-medium hover:underline" style={{ color: 'var(--text-secondary)' }}>
                                    {t('forgotPassword')}
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                            style={{ backgroundColor: 'var(--active-bg)', color: 'var(--active-text)' }}
                        >
                            {isLoading ? t('processing') : mode === 'forgot' ? t('sendResetLink') : mode === 'login' ? t('loginButton') : t('register')}
                        </button>
                    </form>

                    {mode !== 'forgot' && (
                        <>
                            <div className="relative my-5">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full" style={{ borderTop: '1px solid var(--card-border)' }} />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-3" style={{ backgroundColor: 'var(--background)', color: 'var(--text-muted)' }}>
                                        {t('orContinueWith')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <button
                                    onClick={() => handleOAuthLogin('google')}
                                    disabled={!!oauthLoading}
                                    className="w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-3 transition-colors"
                                    style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span>{t('continueWithGoogle')}</span>
                                </button>
                            </div>
                        </>
                    )}

                    <div className="mt-5 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {mode === 'login' ? (
                            <>
                                {t('noAccount')}{' '}
                                <button onClick={() => switchMode('register')} className="font-medium hover:underline" style={{ color: 'var(--text-primary)' }}>
                                    {t('switchToRegister')}
                                </button>
                            </>
                        ) : (
                            <>
                                {t('hasAccount')}{' '}
                                <button onClick={() => switchMode('login')} className="font-medium hover:underline" style={{ color: 'var(--text-primary)' }}>
                                    {t('switchToLogin')}
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
