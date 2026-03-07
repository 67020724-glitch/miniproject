'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface StatCardProps {
    icon: 'total' | 'completed' | 'reading' | 'unread';
    label: string;
    value: number;
    variant?: 'primary' | 'secondary';
}

const icons: Record<string, React.ReactNode> = {
    total: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    ),
    completed: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    reading: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    ),
    unread: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

export default function StatCard({ icon, label, value, variant = 'secondary' }: StatCardProps) {
    const { t } = useLanguage();
    const baseClasses = 'rounded-2xl p-4 md:p-5 flex flex-col justify-between h-full transition-all border shadow-sm hover:shadow-md';

    const variantStyles = variant === 'primary'
        ? { container: 'bg-indigo-600 border-indigo-700 text-white', iconBg: 'bg-white/20 text-white', label: 'text-indigo-100', value: 'text-white' }
        : { container: 'border', iconBg: '', label: '', value: '' };

    const iconColors: Record<string, string> = {
        total: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
        completed: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
        reading: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20',
        unread: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20',
    };

    return (
        <div className={`${baseClasses} ${variantStyles.container}`} style={variant === 'secondary' ? { backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } : undefined}>
            {/* Header with icon and label */}
            <div className="flex flex-col gap-3 mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border ${variant === 'primary' ? variantStyles.iconBg : iconColors[icon]}`}>
                    {icons[icon]}
                </div>
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${variantStyles.label}`} style={variant === 'secondary' ? { color: 'var(--text-secondary)' } : undefined}>
                    {label}
                </span>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1 md:gap-2">
                <span className={`text-3xl md:text-4xl font-black tracking-tight ${variantStyles.value}`} style={variant === 'secondary' ? { color: 'var(--text-primary)' } : undefined}>
                    {value.toString().padStart(1, '0')}
                </span>
                <span className={`text-[10px] md:text-xs font-medium ${variant === 'primary' ? 'text-indigo-200' : ''}`} style={variant === 'secondary' ? { color: 'var(--text-muted)' } : undefined}>
                    {t('books')}
                </span>
            </div>
        </div>
    );
}

