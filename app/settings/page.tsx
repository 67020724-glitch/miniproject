'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
                    title={t('back')}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{t('settingsTitle')}</h1>
            </div>

            <div className="rounded-2xl border p-6 space-y-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div>
                    <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>{t('theme')}</h3>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 ${theme === 'light'
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm'
                                : 'bg-transparent border-transparent hover:bg-gray-50'
                                }`}
                            style={theme !== 'light' ? { backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' } : {}}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="text-sm font-semibold">{t('lightMode')}</span>
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 ${theme === 'dark'
                                ? 'bg-indigo-900/30 border-indigo-500/30 text-indigo-400 shadow-sm'
                                : 'bg-transparent border-transparent hover:bg-gray-800/10'
                                }`}
                            style={theme !== 'dark' ? { backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' } : { border: '1px solid transparent' }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                            <span className="text-sm font-semibold">{t('darkMode')}</span>
                        </button>
                    </div>
                </div>

                <hr style={{ borderColor: 'var(--card-border)' }} />

                {/* Language Settings */}
                <div>
                    <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>{t('language')}</h3>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setLanguage('th')}
                            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${language === 'th'
                                ? 'bg-[#4F46E5] text-white shadow-lg'
                                : 'border hover:bg-gray-50'
                                }`}
                            style={language !== 'th' ? { backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' } : {}}
                        >
                            🇹🇭 ไทย
                        </button>
                        <button
                            onClick={() => setLanguage('en')}
                            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${language === 'en'
                                ? 'bg-[#4F46E5] text-white shadow-lg'
                                : 'border hover:bg-gray-50'
                                }`}
                            style={language !== 'en' ? { backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' } : {}}
                        >
                            🇺🇸 English
                        </button>
                    </div>
                </div>

                <hr style={{ borderColor: 'var(--card-border)' }} />

                {/* Data Management */}
                <div>
                    <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>{t('dataManagement')}</h3>
                    <div className="space-y-3">
                        <button className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm hover:bg-red-50 transition-colors ml-3">
                            {t('deleteAllData')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
