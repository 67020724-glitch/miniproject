'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import AuthForm from './AuthForm';

export default function WelcomePage() {
    const { t } = useLanguage();
    const [view, setView] = useState<'welcome' | 'login' | 'register'>('welcome');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            {/* Logo & Title */}
            <div className="text-center mb-10">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                    <span className="text-gray-500 italic font-light">Story</span><span className="text-gray-700">Nest</span>
                </h1>

                {/* Subtitle */}
                <p className="text-gray-500 text-lg">
                    {t('systemDescription')}
                </p>
            </div>

            {view === 'welcome' ? (
                /* CTA Buttons */
                <div className="flex flex-col gap-4 w-full max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                        onClick={() => setView('register')}
                        className="w-full py-4 bg-gray-700 text-white rounded-2xl hover:bg-gray-800 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl"
                    >
                        {t('getStarted')}
                    </button>
                    <button
                        onClick={() => setView('login')}
                        className="w-full py-4 bg-white text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium text-lg border border-gray-200 shadow-sm"
                    >
                        {t('loginButton')}
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
                    <div className="mb-6 flex items-center gap-2">
                        <button
                            onClick={() => setView('welcome')}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-semibold text-gray-700">
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

