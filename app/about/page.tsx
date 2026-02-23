'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{t('about')}</h1>

            <div className="rounded-2xl border p-8" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="max-w-lg">
                    {/* Logo */}
                    <h2 className="text-3xl font-light italic mb-6" style={{ color: 'var(--text-muted)' }}>
                        Story<span className="font-normal" style={{ color: 'var(--text-primary)' }}>Nest</span>
                        <span className="text-lg align-top" style={{ color: 'var(--text-muted)' }}>+</span>
                    </h2>

                    {/* Description */}
                    <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {t('aboutDescription')}
                    </p>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                        <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{t('mainFeatures')}</h3>
                        <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {t('feature1')}
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {t('feature2')}
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {t('feature3')}
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {t('feature4')}
                            </li>
                        </ul>
                    </div>

                    {/* Tech Stack */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{t('techStack')}</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Next.js</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">React</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">TypeScript</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Tailwind CSS</span>
                        </div>
                    </div>

                    {/* Version */}
                    <p className="text-sm mt-8" style={{ color: 'var(--text-muted)' }}>
                        Version 1.0.0
                    </p>
                </div>
            </div>
        </div>
    );
}

