'use client';

import { useBooks } from '@/context/BookContext';
import { useLanguage } from '@/context/LanguageContext';
import StatCard from '@/components/StatCard';
import CircleChart from '@/components/CircleChart';

export default function LibraryPage() {
    const { books, getBooksByStatus } = useBooks();
    const { t } = useLanguage();

    const totalBooks = books.length;
    const completedBooks = getBooksByStatus('completed').length;
    const readingBooks = getBooksByStatus('reading').length;
    const unreadBooks = getBooksByStatus('unread').length;

    const chartSegments = [
        { value: completedBooks, color: '#22c55e', label: t('completed') },
        { value: readingBooks, color: '#3b82f6', label: t('reading') },
        { value: unreadBooks, color: '#f97316', label: t('unread') },
    ];

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{t('library')}</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total Books - Primary Card */}
                <StatCard
                    icon="total"
                    label={t('totalBooks')}
                    value={totalBooks}
                    variant="primary"
                />

                {/* Completed Books */}
                <StatCard
                    icon="completed"
                    label={t('completed')}
                    value={completedBooks}
                    variant="secondary"
                />

                {/* Reading Books */}
                <StatCard
                    icon="reading"
                    label={t('reading')}
                    value={readingBooks}
                    variant="secondary"
                />

                {/* Unread Books */}
                <StatCard
                    icon="unread"
                    label={t('unread')}
                    value={unreadBooks}
                    variant="secondary"
                />
            </div>

            {/* Circle Chart with Proportions */}
            <CircleChart
                segments={chartSegments}
                total={totalBooks}
            />

            {/* Notes Collection Section */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    {t('readingNotes')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {books.filter(book => book.note).map(book => (
                        <div key={book.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4">
                            {/* Book Cover */}
                            <div className="flex-shrink-0 w-16 h-24 rounded-lg overflow-hidden bg-gray-100">
                                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 dark:text-white truncate">{book.title}</h3>
                                <div className="flex items-center gap-1 mt-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-3 h-3 ${i < (book.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg italic">
                                    "{book.note}"
                                </p>
                            </div>
                        </div>
                    ))}

                    {books.filter(book => book.note).length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            {t('noReadingNotes')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


