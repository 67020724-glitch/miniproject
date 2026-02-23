'use client';

import { useBooks } from '@/context/BookContext';
import { useLanguage } from '@/context/LanguageContext';

export default function SummaryPage() {
    const { books, getBooksByStatus } = useBooks();
    const { t } = useLanguage();

    const totalBooks = books.length;
    const completedBooks = getBooksByStatus('completed').length;
    const readingBooks = getBooksByStatus('reading').length;
    const unreadBooks = getBooksByStatus('unread').length;

    // Calculate percentages
    const completedPercent = totalBooks > 0 ? Math.round((completedBooks / totalBooks) * 100) : 0;
    const readingPercent = totalBooks > 0 ? Math.round((readingBooks / totalBooks) * 100) : 0;
    const unreadPercent = totalBooks > 0 ? Math.round((unreadBooks / totalBooks) * 100) : 0;

    // Reading progress score (completed = 100%, reading = 50%, unread = 0%)
    const progressScore = totalBooks > 0
        ? Math.round(((completedBooks * 100) + (readingBooks * 50)) / totalBooks)
        : 0;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{t('summary')}</h1>

            {/* Progress Score */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl p-6 text-white">
                <h3 className="text-gray-300 text-sm mb-2">{t('readingProgressScore')}</h3>
                <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold">{progressScore}</span>
                    <span className="text-2xl text-gray-400 mb-1">/ 100</span>
                </div>
                <div className="mt-4 bg-gray-600 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-green-400 h-full transition-all duration-500"
                        style={{ width: `${progressScore}%` }}
                    />
                </div>
                <p className="text-gray-400 text-xs mt-2">
                    {t('scoreCalculation')}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Completed */}
                <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('completed')}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{completedBooks}</span>
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('books')}</span>
                    </div>
                    <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-green-500 h-full transition-all duration-500"
                            style={{ width: `${completedPercent}%` }}
                        />
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{completedPercent}% {t('ofTotal')}</p>
                </div>

                {/* Reading */}
                <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('reading')}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{readingBooks}</span>
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('books')}</span>
                    </div>
                    <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-blue-500 h-full transition-all duration-500"
                            style={{ width: `${readingPercent}%` }}
                        />
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{readingPercent}% {t('ofTotal')}</p>
                </div>

                {/* Unread */}
                <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('unread')}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{unreadBooks}</span>
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('books')}</span>
                    </div>
                    <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-orange-500 h-full transition-all duration-500"
                            style={{ width: `${unreadPercent}%` }}
                        />
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{unreadPercent}% {t('ofTotal')}</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total Books */}
                <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    <h3 className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>📚 {t('librarySummary')}</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span style={{ color: 'var(--text-muted)' }}>{t('totalBooks')}</span>
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{totalBooks} {t('books')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span style={{ color: 'var(--text-muted)' }}>{t('completed')}</span>
                            <span className="font-semibold text-green-600">{completedBooks} {t('books')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span style={{ color: 'var(--text-muted)' }}>{t('reading')}</span>
                            <span className="font-semibold text-blue-600">{readingBooks} {t('books')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span style={{ color: 'var(--text-muted)' }}>{t('waiting')}</span>
                            <span className="font-semibold text-orange-600">{unreadBooks} {t('books')}</span>
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    <h3 className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>💡 {t('tips')}</h3>
                    <div className="space-y-3">
                        {unreadBooks > 0 && (
                            <div className="flex items-start gap-2 text-sm">
                                <span className="text-orange-500">•</span>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    {t('tipUnread').replace('{count}', String(unreadBooks))}
                                </span>
                            </div>
                        )}
                        {readingBooks > 3 && (
                            <div className="flex items-start gap-2 text-sm">
                                <span className="text-blue-500">•</span>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    {t('tipMultipleReading')}
                                </span>
                            </div>
                        )}
                        {completedBooks > 0 && (
                            <div className="flex items-start gap-2 text-sm">
                                <span className="text-green-500">•</span>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    {t('tipCompleted').replace('{count}', String(completedBooks))}
                                </span>
                            </div>
                        )}
                        {totalBooks === 0 && (
                            <div className="flex items-start gap-2 text-sm">
                                <span style={{ color: 'var(--text-muted)' }}>•</span>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    {t('tipEmpty')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

