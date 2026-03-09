'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import AuthForm from './AuthForm';

export default function WelcomePage() {
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [view, setView] = useState<'welcome' | 'login' | 'register'>('welcome');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
            {/* Top Bar Controls */}
            <div className="absolute top-6 right-6 flex items-center gap-3">
                {/* Language Toggle */}
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm border"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    {theme === 'light' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )}
                </button>
            </div>
            {/* Logo & Title */}
            <div className="text-center mb-10">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                    <span className="italic font-light" style={{ color: 'var(--text-muted)' }}>Story</span><span style={{ color: 'var(--text-primary)' }}>Nest</span>
                </h1>

                {/* Subtitle */}
                <p style={{ color: 'var(--text-secondary)' }} className="text-lg">
                    {t('systemDescription')}
                </p>
            </div>

            {view === 'welcome' ? (
                /* CTA Buttons */
                <div className="flex flex-col gap-4 w-full max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                        onClick={() => setView('register')}
                        className="w-full py-4 bg-[#4F46E5] text-white rounded-2xl hover:bg-indigo-700 transition-all duration-200 font-bold text-lg shadow-lg shadow-indigo-100 dark:shadow-none hover:shadow-indigo-200"
                    >
                        {t('getStarted')}
                    </button>
                    <button
                        onClick={() => setView('login')}
                        className="w-full py-4 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 font-medium text-lg border border-gray-200 dark:border-slate-700 shadow-sm"
                    >
                        {t('loginButton')}
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
                    <div className="mb-6 flex items-center gap-2">
                        <button
                            onClick={() => setView('welcome')}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-500 dark:text-gray-400"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                            {view === 'login' ? t('loginTitle') : t('registerTitle')}
                        </h2>
                    </div>

                    <AuthForm
                        initialMode={view}
                        onSwitchMode={(mode) => {
                            if (mode === 'login' || mode === 'register') setView(mode);
                        }}
                    />
                </div>
            )}
        </div>
    );
}

