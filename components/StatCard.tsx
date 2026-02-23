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
    const baseClasses = 'rounded-2xl p-4 flex flex-col justify-between h-full';
    const variantClasses = {
        primary: 'bg-gray-700 text-white',
        secondary: 'bg-white border border-gray-200 text-gray-700',
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]}`}>
            {/* Header with icon and label */}
            <div className="flex items-center gap-2 mb-2">
                <span className={variant === 'primary' ? 'text-gray-300' : 'text-gray-500'}>
                    {icons[icon]}
                </span>
                <span className={`text-sm ${variant === 'primary' ? 'text-gray-200' : 'text-gray-600'}`}>
                    {label}
                </span>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">
                    {value.toString().padStart(2, '0')}
                </span>
                <span className={`text-sm ${variant === 'primary' ? 'text-gray-300' : 'text-gray-500'}`}>
                    {t('books')}
                </span>
            </div>
        </div>
    );
}

