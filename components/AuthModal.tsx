'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const { login, register } = useAuth();
    const { t } = useLanguage();
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setError('');
            setName('');
            setPassword('');
            setConfirmPassword('');
            setRememberMe(true);
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (mode === 'register') {
                if (password !== confirmPassword) {
                    setError('รหัสผ่านไม่ตรงกัน');
                    setIsLoading(false);
                    return;
                }
                const result = await register(name, email.trim(), password);
                if (result.success) {
                    onClose();
                    resetForm();
                } else {
                    let errMsg = result.error || 'การลงทะเบียนล้มเหลว';
                    // Translate common Supabase errors
                    if (errMsg.includes('already registered')) errMsg = 'อีเมลนี้ถูกใช้งานแล้ว';
                    if (errMsg.includes('invalid')) errMsg = 'อีเมลหรือรูปแบบไม่ถูกต้อง';
                    if (errMsg.includes('Password should be')) errMsg = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
                    setError(errMsg);
                }
            } else {
                const result = await login(email.trim(), password, rememberMe);
                if (result.success) {
                    onClose();
                    resetForm();
                } else {
                    let errMsg = result.error || 'การเข้าสู่ระบบล้มเหลว';
                    // Translate common Supabase errors
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

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRememberMe(true);
        setError('');
    };

    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setError('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 p-6">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {mode === 'login' ? t('loginTitle') : t('registerTitle')}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {mode === 'login'
                            ? t('loginSubtitle')
                            : t('registerSubtitle')}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('nameLabel')}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('namePlaceholder')}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('emailLabel')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('passwordLabel')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                        />
                    </div>

                    {mode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('confirmPasswordLabel')}</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                            />
                        </div>
                    )}

                    {mode === 'login' && (
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-gray-700 focus:ring-gray-700 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                {t('rememberMe')}
                            </label>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? t('processing') : mode === 'login' ? t('loginButton') : t('register')}
                    </button>
                </form>

                {/* Switch Mode */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    {mode === 'login' ? (
                        <>
                            {t('noAccount')}{' '}
                            <button onClick={switchMode} className="text-gray-700 font-medium hover:underline">
                                {t('switchToRegister')}
                            </button>
                        </>
                    ) : (
                        <>
                            {t('hasAccount')}{' '}
                            <button onClick={switchMode} className="text-gray-700 font-medium hover:underline">
                                {t('switchToLogin')}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
