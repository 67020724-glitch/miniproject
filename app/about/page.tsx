'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
    const { t } = useLanguage();


    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {t('about')}
            </h1>

            <div className="rounded-2xl border p-8" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="max-w-lg">
                    {/* Logo & Share Button */}
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-light italic" style={{ color: 'var(--text-muted)' }}>
                            Story<span className="font-normal" style={{ color: 'var(--text-primary)' }}>Nest</span>
                            <span className="text-lg align-top" style={{ color: 'var(--text-muted)' }}>+</span>
                        </h2>


                    </div>

                    <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {t('aboutDescription')}
                    </p>
                </div>
            </div>
        </div>
    );
}