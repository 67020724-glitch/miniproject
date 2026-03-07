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
        <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12 pb-20 px-2 sm:px-0 animate-fade-in">
            <header className="px-2 md:px-0">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('library')}</h1>
                <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>{t('librarySubtitle') || 'Manage and organize your personal bookshelf'}</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="px-1 md:px-0">
                <CircleChart
                    segments={chartSegments}
                    total={totalBooks}
                />
            </div>

            {/* Bookmarks Section */}
            <div className="mt-6 md:mt-10">
                <h2 className="text-xl md:text-3xl font-black mb-8 px-2 md:px-0 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 flex items-center justify-center text-xl md:text-2xl shadow-sm">
                        🔖
                    </div>
                    {t('bookmarks')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {books.filter(book => book.status === 'reading').map(book => {
                        const progress = book.totalPages && book.totalPages > 0
                            ? Math.min(100, Math.round(((book.pagesRead || 0) / book.totalPages) * 100))
                            : 0;

                        return (
                            <div key={book.id} className="relative group p-5 md:p-6 rounded-[2rem] shadow-sm flex gap-5 transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden border min-h-[0px]"
                                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                                {/* Decorative Bookmark Ribbon */}
                                <div className="absolute top-0 right-6 w-5 md:w-6 h-8 md:h-10 bg-[#4F46E5] dark:bg-indigo-500 shadow-sm rounded-b-md" />

                                {/* Book Cover with progress overlay */}
                                <div className="relative flex-shrink-0 w-20 h-28 md:w-24 md:h-36 rounded-2xl overflow-hidden shadow-md border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}>
                                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    {/* Small circle progress */}
                                    <div className="absolute inset-0 bg-indigo-900/10 dark:bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-[10px] md:text-xs font-black shadow-xl border border-white/20 dark:border-slate-700/50"
                                            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
                                            {progress}%
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                    <div className="pt-2">
                                        <h3 className="font-black text-lg md:text-xl leading-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" style={{ color: 'var(--text-primary)' }}>{book.title}</h3>
                                        <p className="text-xs md:text-sm font-bold truncate mb-3" style={{ color: 'var(--text-secondary)' }}>{book.author}</p>
                                    </div>

                                    {/* Bookmark Info */}
                                    <div className="space-y-3 md:space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 px-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-[#4F46E5] dark:text-indigo-400 text-[10px] md:text-xs font-black uppercase tracking-widest border border-indigo-100/50 dark:border-indigo-500/20 shadow-sm">
                                                {t('onPage')} {book.pagesRead || 0}
                                            </div>
                                            <span className="text-[10px] md:text-xs font-bold" style={{ color: 'var(--text-muted)' }}>/ {book.totalPages || '?'} {t('pages')}</span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-[10px] md:text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-[#E5E7EB] dark:bg-slate-700 rounded-full overflow-hidden p-0.5 border" style={{ borderColor: 'var(--card-border)' }}>
                                                <div
                                                    className="h-full bg-[#4F46E5] dark:bg-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {books.filter(book => book.status === 'reading').length === 0 && (
                        <div className="col-span-full text-center py-20 bg-gray-50/50 dark:bg-slate-800/30 rounded-[3rem] border-2 border-dashed flex flex-col items-center" style={{ borderColor: 'var(--card-border)' }}>
                            <div className="w-20 h-20 rounded-3xl shadow-sm border flex items-center justify-center text-4xl mb-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                                📖
                            </div>
                            <p className="text-sm md:text-base font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                {t('noBookmarksTitle')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


