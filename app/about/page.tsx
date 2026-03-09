'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
    const { t } = useLanguage();
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
                <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {t('about')}
                </h1>
            </div>

            <div className="rounded-[2.5rem] border p-8 md:p-12 space-y-12" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="max-w-3xl">
                    <h2 className="text-4xl font-light italic mb-6" style={{ color: 'var(--text-muted)' }}>
                        Story<span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Nest</span>
                        <span className="text-xl align-top" style={{ color: 'var(--text-primary)' }}>+</span>
                    </h2>

                    <p className="text-lg md:text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {t('aboutDescription')}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="space-y-8">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                        {t('mainFeatures')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="group p-6 rounded-[2rem] border hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--card-border)' }}>
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                    {i === 1 && '📚'}
                                    {i === 2 && '📈'}
                                    {i === 3 && '🎯'}
                                    {i === 4 && '🔍'}
                                </div>
                                <h4 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                    {t(`featureTitle${i}` as any)}
                                </h4>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    {t(`featureDesc${i}` as any)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mission & Privacy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t" style={{ borderColor: 'var(--card-border)' }}>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                            ✨ {t('ourMission')}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {t('missionDesc')}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                            🔒 {t('privacyPolicy')}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {t('privacyDesc')}
                        </p>
                    </div>
                </div>

                {/* Tech Stack & Version */}
                <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'var(--card-border)' }}>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                           {t('techStack')}: Next.js, Firebase, Tailwind CSS
                        </span>
                    </div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        {t('version')} 1.2.0 © 2024 StoryNest Team
                    </p>
                </div>
            </div>
        </div>
    );
}