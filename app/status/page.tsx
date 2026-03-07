'use client';

import { useState, useEffect } from 'react';
import { useBooks } from '@/context/BookContext';
import { useLanguage } from '@/context/LanguageContext';
import BookCard from '@/components/BookCard';
import EditBookModal from '@/components/EditBookModal';
import { Book, BookStatus } from '@/types/book';

type TabType = 'all' | BookStatus;

type TabKey = 'all' | 'reading' | 'completed' | 'unread';

const tabKeys: { key: TabType; labelKey: TabKey; icon: string }[] = [
    { key: 'all', labelKey: 'all', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { key: 'reading', labelKey: 'reading', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { key: 'completed', labelKey: 'completed', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'unread', labelKey: 'unread', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export default function StatusPage() {
    const { books, getBooksByStatus, deleteBook, updateBook, toggleFavorite } = useBooks();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBookForEdit, setSelectedBookForEdit] = useState<Book | null>(null);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

    // Yearly Goal State
    const [yearlyGoal, setYearlyGoal] = useState<number>(10);
    const [tempGoal, setTempGoal] = useState<string>('10');

    // Load goal from localStorage
    useEffect(() => {
        const savedGoal = localStorage.getItem('storynest-yearly-goal');
        if (savedGoal) {
            setYearlyGoal(parseInt(savedGoal, 10));
            setTempGoal(savedGoal);
        }
    }, []);

    const saveGoal = () => {
        const goalValue = parseInt(tempGoal, 10);
        if (!isNaN(goalValue) && goalValue >= 0) {
            setYearlyGoal(goalValue);
            localStorage.setItem('storynest-yearly-goal', goalValue.toString());
            setIsGoalModalOpen(false);
        }
    };

    // Calculate Stats
    const currentYear = new Date().getFullYear();
    const booksCompletedThisYear = books.filter(book =>
        book.status === 'completed' &&
        book.completedAt &&
        new Date(book.completedAt).getFullYear() === currentYear
    );
    const booksReadCount = booksCompletedThisYear.length;
    const goalProgress = yearlyGoal > 0 ? Math.min(Math.round((booksReadCount / yearlyGoal) * 100), 100) : 0;

    // Page count stats
    const totalPagesRead = books.reduce((acc, book) => acc + (book.pagesRead || 0), 0);
    const pagesReadThisYear = booksCompletedThisYear.reduce((acc, book) => acc + (book.pagesRead || 0), 0);

    const filteredBooks = activeTab === 'all' ? books : getBooksByStatus(activeTab);

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Header / Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 text-white p-8 md:p-12 shadow-2xl">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold uppercase tracking-widest text-blue-300">
                            {t('readingProgressYear').replace('{year}', currentYear.toString())}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            {t('annualStats')} <span className="text-blue-400">Dashboard</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-md">
                            {t('scoreCalculation')}
                        </p>
                    </div>

                    <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-2">
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black text-white">{booksReadCount}</span>
                            <span className="text-2xl text-white/40 font-bold">/ {yearlyGoal}</span>
                        </div>
                        <p className="text-sm font-medium text-blue-300 uppercase tracking-widest">{t('completed')}</p>
                        <button
                            onClick={() => setIsGoalModalOpen(true)}
                            className="mt-4 px-6 py-2.5 rounded-2xl bg-white text-gray-900 text-sm font-bold shadow-xl hover:scale-105 transition-transform active:scale-95"
                        >
                            {t('setReadingGoal')}
                        </button>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div className="relative mt-12 space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-white/50 px-1">
                        <span>{t('progressLabel')} ({goalProgress}%)</span>
                        <span>{booksReadCount >= yearlyGoal ? t('goalCompletedYear') : t('remainingBooks').replace('{count}', (yearlyGoal - booksReadCount).toString())}</span>
                    </div>
                    <div className="h-6 w-full bg-white/5 rounded-2xl p-1.5 border border-white/5">
                        <div
                            className="h-full rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-1500 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                            style={{ width: `${goalProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('pagesReadLabel')}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{totalPagesRead.toLocaleString()}</p>
                        {pagesReadThisYear > 0 && (
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-lg">+{pagesReadThisYear.toLocaleString()}</span>
                        )}
                    </div>
                </div>

                <div className="group rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                        </svg>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('totalBooks')}</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{books.length}</p>
                </div>

                <div className="group rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('reading')}</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{getBooksByStatus('reading').length}</p>
                </div>

                <div className="group rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('favorites')}</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{books.filter(b => b.isFavorite).length}</p>
                </div>
            </div>

            {/* Content Explorer Section */}
            <div className="space-y-8">
                <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl sticky top-4 z-20 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-2 shadow-2xl overflow-hidden">
                    <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
                        {tabKeys.map((tab) => {
                            const active = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-500 whitespace-nowrap overflow-hidden group ${active ? 'text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                >
                                    {active && (
                                        <div className="absolute inset-0 bg-gray-900 dark:bg-white rounded-2xl -z-10 animate-zoom-in duration-500" />
                                    )}
                                    <svg className={`w-4 h-4 transition-colors duration-300 ${active ? 'text-white dark:text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} />
                                    </svg>
                                    <span className={active ? 'dark:text-gray-900' : ''}>{t(tab.labelKey)}</span>
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${active ? 'bg-white/20 text-white dark:bg-gray-900/10 dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                        {tab.key === 'all' ? books.length : getBooksByStatus(tab.key as BookStatus).length}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                        {filteredBooks.map((book, index) => (
                            <div key={book.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <BookCard
                                    book={book}
                                    size="medium"
                                    showActions={true}
                                    showYear={true}
                                    onDelete={deleteBook}
                                    onStatusChange={(id, status) => updateBook(id, { status })}
                                    onRatingChange={(id, rating) => updateBook(id, { rating })}
                                    onEdit={(book) => {
                                        setSelectedBookForEdit(book);
                                        setIsEditModalOpen(true);
                                    }}
                                    onFavorite={toggleFavorite}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-8 rounded-[3rem] bg-gray-50/50 dark:bg-gray-800/10 border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center mb-8 border border-gray-100 dark:border-gray-700">
                            <svg className="w-10 h-10 text-gray-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('noBooksInCategory')}</h3>
                        <p className="text-gray-500 max-w-xs text-center font-medium leading-relaxed">{t('tipEmpty')}</p>
                    </div>
                )}
            </div>

            {/* Glassmorphic Goal Modal */}
            {isGoalModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fade-in" onClick={() => setIsGoalModalOpen(false)} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-zoom-in border border-white/20">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{t('setReadingGoal')}</h2>
                                <p className="text-gray-500 font-medium">{t('enterGoal')}</p>
                            </div>
                            <button onClick={() => setIsGoalModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="relative group mb-10">
                            <input
                                type="number"
                                value={tempGoal}
                                onChange={(e) => setTempGoal(e.target.value)}
                                className="w-full px-6 py-8 rounded-3xl border-4 border-gray-100 dark:border-gray-700 dark:bg-gray-900 text-6xl font-black text-center focus:border-blue-500 transition-all outline-none"
                                style={{ color: 'var(--text-primary)' }}
                                min="0"
                            />
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-1 bg-blue-600 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/40">
                                {t('books')}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsGoalModalOpen(false)}
                                className="flex-1 px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 dark:text-white font-bold hover:bg-gray-100 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={saveGoal}
                                className="flex-1 px-4 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black hover:opacity-90 shadow-[0_10px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-all active:scale-95"
                            >
                                {t('saveGoal')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Book Modal */}
            <EditBookModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedBookForEdit(null);
                }}
                book={selectedBookForEdit}
            />
        </div>
    );
}
