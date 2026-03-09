'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useBooks } from '@/context/BookContext';
import { useLanguage } from '@/context/LanguageContext';
import { Book, BookStatus } from '@/types/book';
import UpdateProgressModal from '@/components/UpdateProgressModal';

export default function Dashboard() {
    const { books, getBooksByStatus, updateBook, getReadingLogByDate } = useBooks();
    const { t, language } = useLanguage();
    const router = useRouter();

    // Yearly Goal
    const [yearlyGoal, setYearlyGoal] = useState<number>(30);
    const [tempGoal, setTempGoal] = useState<number>(30);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
    const [selectedBookForProgress, setSelectedBookForProgress] = useState<Book | null>(null);

    const [historyDate, setHistoryDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [historyLogs, setHistoryLogs] = useState<{ bookId: string; title: string; pagesRead: number; completed?: boolean; coverUrl?: string }[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

    useEffect(() => {
        const savedGoal = localStorage.getItem('storynest-yearly-goal');
        if (savedGoal) {
            const val = parseInt(savedGoal, 10);
            setYearlyGoal(val);
            setTempGoal(val);
        }
    }, []);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsHistoryLoading(true);
            const logs = await getReadingLogByDate(historyDate);
            setHistoryLogs(logs);
            setIsHistoryLoading(false);
        };
        fetchHistory();
    }, [historyDate, getReadingLogByDate]);

    const saveGoal = () => {
        setYearlyGoal(tempGoal);
        localStorage.setItem('storynest-yearly-goal', tempGoal.toString());
        setIsGoalModalOpen(false);
    };

    const currentYear = new Date().getFullYear();
    const completedThisYear = useMemo(() => {
        return books.filter(b =>
            b.status === 'completed' &&
            b.completedAt &&
            new Date(b.completedAt).getFullYear() === currentYear
        );
    }, [books, currentYear]);

    const booksReadCount = completedThisYear.length;
    const goalProgress = Math.min(Math.round((booksReadCount / yearlyGoal) * 100), 100);

    const readingBooks = getBooksByStatus('reading');
    const finishedBooksCount = getBooksByStatus('completed').length;
    const unreadBooksCount = getBooksByStatus('unread').length;
    const totalBooks = books.length;

    // Monthly average
    const currentMonth = new Date().getMonth() + 1;
    const avgPerMonth = (booksReadCount / currentMonth).toFixed(1);

    const finishedMonthlyCount = useMemo(() => {
        const now = new Date();
        return books.filter(b =>
            b.status === 'completed' &&
            b.completedAt &&
            new Date(b.completedAt).getMonth() === now.getMonth() &&
            new Date(b.completedAt).getFullYear() === now.getFullYear()
        ).length;
    }, [books]);

    const dailyPageGoalTarget = useMemo(() => {
        return readingBooks.reduce((sum, b) => sum + (b.pagesPerDay || 0), 0);
    }, [readingBooks]);

    const totalPagesAccumulated = useMemo(() => {
        return books.reduce((sum, book) => sum + (book.pagesRead || 0), 0);
    }, [books]);

    // 🏆 Automatic Achievement System
    const checkAchievements = (allBooks: Book[], readCount: number, currentYearRead: number, goal: number, totalPages: number) => {
        const finishedCount = allBooks.filter(b => b.status === 'completed').length;

        return [
            {
                id: 'first_reader',
                title: t('achievement1'),
                icon: '🎯',
                condition: finishedCount >= 1,
                requirement: `1 ${t('books')}`,
                currentValue: finishedCount,
                neededValue: 1
            },
            {
                id: 'book_explorer',
                title: t('achievement5'),
                icon: '📚',
                condition: finishedCount >= 5,
                requirement: `5 ${t('books')}`,
                currentValue: finishedCount,
                neededValue: 5
            },
            {
                id: 'page_seeker',
                title: t('achievementPageSeeker'),
                icon: '📑',
                condition: totalPages >= 1000,
                requirement: `1,000 ${t('pages')}`,
                currentValue: totalPages,
                neededValue: 1000
            },
            {
                id: 'goal_achiever',
                title: t('achievementGoal'),
                icon: '🏆',
                condition: currentYearRead >= goal && goal > 0,
                requirement: t('achievementGoalDesc').replace('{year}', String(currentYear)).replace('{goal}', String(goal)),
                currentValue: currentYearRead,
                neededValue: goal
            },
        ];
    };

    const achievements = useMemo(() =>
        checkAchievements(books, finishedBooksCount, booksReadCount, yearlyGoal, totalPagesAccumulated),
        [books, finishedBooksCount, booksReadCount, yearlyGoal, totalPagesAccumulated, t, language]
    );

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-10 pb-20 animate-fade-in px-2 sm:px-0">
            <header className="px-2 md:px-0 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-xl transition-all hover:scale-110 active:scale-90"
                    style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--hover-bg)' }}
                    title={t('back')}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('dashboard')}</h1>
                    <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>{t('dashboardDesc') || 'Overview of your reading journey'}</p>
                </div>
            </header>

            {/* 1. Reading Goal Section */}
            <section className="relative overflow-hidden rounded-2xl border p-8 md:p-12 shadow-sm transition-all hover:shadow-md bg-white dark:bg-indigo-900/10 border-[#E2E8F0] dark:border-indigo-500/20">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px]" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center" style={{ color: 'var(--text-primary)' }}>
                    <div className="space-y-6">
                        <div>
                            <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-2">{t('readingProgressYear').replace('{year}', String(currentYear))}</p>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('readingGoalTitle')}</h2>
                        </div>
                        <div className="flex items-center gap-6 md:gap-10">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{t('currentGoal')}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl md:text-4xl font-black">{yearlyGoal} <span className="text-sm md:text-lg font-normal opacity-60">{t('books')}</span></span>
                                    <button
                                        onClick={() => setIsGoalModalOpen(true)}
                                        className="p-2 rounded-lg bg-indigo-100/50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-[#E2E8F0] dark:bg-slate-700" />
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{t('completed')}</span>
                                <span className="text-3xl md:text-4xl font-black text-indigo-600 dark:text-indigo-400">{booksReadCount} <span className="text-sm md:text-lg font-normal opacity-60">{t('books')}</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="flex justify-between items-end px-1">
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black" style={{ color: 'var(--text-primary)' }}>{goalProgress}</span>
                                <span className="text-xl font-bold" style={{ color: 'var(--text-secondary)' }}>%</span>
                            </div>
                            <span className="text-xs font-semibold px-3 py-1.5 rounded-full border bg-white/50 dark:bg-indigo-500/10 border-white/50 dark:border-indigo-500/20" style={{ color: 'var(--text-secondary)' }}>{booksReadCount >= yearlyGoal ? t('goalCompletedYear') : t('remainingBooks').replace('{count}', String(yearlyGoal - booksReadCount))}</span>
                        </div>
                        <div className="h-4 w-full bg-slate-100 dark:bg-indigo-500/10 rounded-full overflow-hidden shadow-inner border border-slate-200/50 dark:border-indigo-500/10">
                            <div
                                className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                                style={{ width: `${goalProgress}%`, backgroundColor: '#6366F1' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Reading Progress Summary (3 Cards) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        key: 'completed', label: t('completed'), count: finishedBooksCount, icon: (
                            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ), accent: 'emerald'
                    },
                    {
                        key: 'reading', label: t('reading'), count: readingBooks.length, icon: (
                            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        ), accent: 'blue'
                    },
                    {
                        key: 'unread', label: t('unread'), count: unreadBooksCount, icon: (
                            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ), accent: 'orange'
                    },
                ].map((item, idx) => {
                    const percent = totalBooks > 0 ? Math.round((item.count / totalBooks) * 100) : 0;
                    const accentColors: any = {
                        emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
                        blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
                        orange: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20',
                    };
                    const accentBar: any = {
                        emerald: 'bg-emerald-500',
                        blue: 'bg-blue-500',
                        orange: 'bg-orange-500',
                    };
                    return (
                        <div key={item.key} className="group p-6 md:p-8 rounded-2xl border shadow-[0_4px_12px_rgba(0,0,0,0.04)] animate-slide-up transition-all hover:scale-[1.01]" 
                            style={{ 
                                animationDelay: `${idx * 100}ms`,
                                backgroundColor: 'var(--card-bg)',
                                borderColor: 'var(--card-border)'
                            }}>
                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-xl md:text-3xl border ${accentColors[item.accent]}`}>
                                    {item.icon}
                                </div>
                                <span className={`text-xl md:text-3xl font-black ${item.accent === 'emerald' ? 'text-emerald-500' : item.accent === 'blue' ? 'text-blue-500' : 'text-orange-500'}`}>{percent}%</span>
                            </div>
                            <h3 className="font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-secondary)' }}>{item.label}</h3>
                            <p className="text-3xl md:text-4xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>{item.count} <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>{t('books')}</span></p>
                            <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--hover-bg)' }}>
                                <div className={`h-full ${accentBar[item.accent]} transition-all duration-1000`} style={{ width: `${percent}%` }} />
                            </div>
                        </div>
                    );
                })}
            </section>

            <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* 4. Currently Reading Section */}
                    <section className="space-y-6">
                        <div className="flex justify-between items-end px-2 md:px-0">
                            <h3 className="text-xl md:text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{t('currentlyReading')}</h3>
                            <p className="text-xs md:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{readingBooks.length} {t('books')}</p>
                        </div>
                        {readingBooks.length > 0 ? (
                            <div className="space-y-4">
                                {readingBooks.map((book) => {
                                    const progress = book.totalPages && book.totalPages > 0
                                        ? Math.min(100, Math.round(((book.pagesRead || 0) / book.totalPages) * 100))
                                        : 0;
                                    return (
                                        <div key={book.id} className="group flex items-center gap-4 md:gap-6 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border"
                                            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                                            <div className="relative w-16 h-24 md:w-20 md:h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
                                                <img src={book.coverUrl} className="w-full h-full object-cover" alt={book.title} />
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-4">
                                                <div>
                                                    <h4 className="font-bold text-lg md:text-xl leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>{book.title}</h4>
                                                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{book.author}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                                        <span style={{ color: 'var(--text-secondary)' }}>{progress}%</span>
                                                        <span className="hidden xs:inline">{book.pagesRead || 0} / {book.totalPages || '?'} {t('pages')}</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden border border-slate-200/50 dark:border-transparent">
                                                        <div className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-700 shadow-sm" style={{ width: `${progress}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedBookForProgress(book);
                                                    setIsProgressModalOpen(true);
                                                }}
                                                className="hidden sm:flex px-6 py-3 rounded-xl bg-[#4F46E5] dark:bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all active:scale-95 shadow-sm"
                                            >
                                                {t('readMore')}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-12 rounded-[2.5rem] bg-gray-50/50 dark:bg-slate-800/30 border-2 border-dashed border-gray-200 dark:border-slate-700 text-center">
                                <p className="font-bold" style={{ color: 'var(--text-muted)' }}>{t('noBooksInSection')}</p>
                            </div>
                        )}
                    </section>

                    {/* 3. Reading Statistics Section */}
                    <section className="space-y-6">
                        <h3 className="text-lg md:text-2xl font-black px-2 md:px-0" style={{ color: 'var(--text-primary)' }}>{t('readingStats')}</h3>

                        {/* Highlights: Daily, Monthly, Yearly */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="p-6 rounded-2xl shadow-sm overflow-hidden relative group transition-all hover:shadow-md border"
                                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                                <div className="absolute -right-4 -bottom-4 text-amber-500/15 group-hover:rotate-12 transition-transform">
                                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" />
                                    </svg>
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{t('today')}</p>
                                <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                                    {historyDate === new Date().toISOString().split('T')[0] ? historyLogs.reduce((sum, l) => sum + l.pagesRead, 0) : '?'} <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/ {dailyPageGoalTarget} {t('pages')}</span>
                                </p>
                                <p className="text-[10px] mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>{t('readingProgress')}</p>
                            </div>
                            <div className="p-6 rounded-2xl shadow-sm overflow-hidden relative group transition-all hover:shadow-md border"
                                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                                <div className="absolute -right-4 -bottom-4 text-blue-500/15 group-hover:rotate-12 transition-transform">
                                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                    </svg>
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{t('thisMonth')}</p>
                                <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                                    {finishedMonthlyCount} <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>{t('books')}</span>
                                </p>
                                <p className="text-[10px] mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>{t('readThisMonth')}</p>
                            </div>
                            <div className="p-6 rounded-2xl shadow-sm overflow-hidden relative group transition-all hover:shadow-md border"
                                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                                <div className="absolute -right-4 -bottom-4 text-emerald-500/15 group-hover:rotate-12 transition-transform">
                                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 003.61-2.96C19.08 10.63 21 8.55 21 6V5c0-1.1-.9-2-2-2zm-12 5c-1.1 0-2-.9-2-2V7h2v3H7zm12-2c0 1.1-.9 2-2 2h-2V7h2v1z" />
                                    </svg>
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{currentYear}</p>
                                <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                                    {booksReadCount} <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>{t('books')}</span>
                                </p>
                                <p className="text-[10px] mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>{t('booksReadYear')}</p>
                            </div>
                        </div>

                        {/* 📊 Reading History / Lookback */}
                        <div className="p-6 md:p-8 rounded-2xl border shadow-sm relative overflow-hidden group"
                            style={{ 
                                backgroundColor: 'var(--card-bg)', 
                                borderColor: 'var(--card-border)'
                            }}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h3 className="text-xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>{t('viewOtherDays')}</h3>
                                    <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{t('selectDate')}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => {
                                            const d = new Date(historyDate);
                                            d.setDate(d.getDate() - 1);
                                            setHistoryDate(d.toISOString().split('T')[0]);
                                        }}
                                        className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors border"
                                        style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <input 
                                        type="date" 
                                        value={historyDate}
                                        onChange={(e) => setHistoryDate(e.target.value)}
                                        className="px-4 py-2 rounded-xl border font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                                    />
                                    <button 
                                        onClick={() => {
                                            const d = new Date(historyDate);
                                            d.setDate(d.getDate() + 1);
                                            const today = new Date().toISOString().split('T')[0];
                                            const nextDate = d.toISOString().split('T')[0];
                                            if (nextDate <= today) {
                                                setHistoryDate(nextDate);
                                            }
                                        }}
                                        className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors border disabled:opacity-30"
                                        style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                                        disabled={historyDate === new Date().toISOString().split('T')[0]}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {isHistoryLoading ? (
                                <div className="flex justify-center py-10">
                                    <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                </div>
                            ) : historyLogs.length > 0 ? (
                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest px-1" style={{ color: 'var(--text-muted)' }}>
                                        {t('pagesReadOn').replace('{date}', historyDate)}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {historyLogs.map((log, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-indigo-500/20 bg-transparent"
                                                style={{ 
                                                    // Only override with variables if we want to ensure theme sync, 
                                                    // but here we use specific classes for better light mode contrast
                                                }}>
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    {log.coverUrl ? (
                                                        <div className="w-8 h-10 flex-shrink-0 rounded shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
                                                            <img src={log.coverUrl} className="w-full h-full object-cover" alt={log.title} />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs ring-1 ring-indigo-200 dark:ring-indigo-800/50">
                                                            {log.title.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-bold truncate max-w-[120px] sm:max-w-[200px]" style={{ color: 'var(--text-primary)' }}>{log.title}</span>
                                                        {log.completed && (
                                                            <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-500 flex items-center gap-0.5">
                                                                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                                                {t('completed')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-lg font-black text-indigo-700 dark:text-indigo-400 leading-none">{log.pagesRead}</span>
                                                    <span className="text-[10px] uppercase font-bold tracking-tighter mt-0.5" style={{ color: 'var(--text-muted)' }}>{t('pages')}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-dashed" style={{ borderColor: 'var(--card-border)' }}>
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-xs font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>Total</span>
                                            <span className="text-xl font-black text-indigo-700 dark:text-indigo-400">
                                                {historyLogs.reduce((sum, l) => sum + l.pagesRead, 0)} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>{t('pages')}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 rounded-2xl bg-gray-50/50 dark:bg-slate-800/10 border-2 border-dashed border-gray-100 dark:border-slate-800">
                                    <p className="text-sm font-bold opacity-40" style={{ color: 'var(--text-muted)' }}>{t('noDataForDate')}</p>
                                </div>
                            )}
                        </div>

                        {/* General Library Distribution */}
                        <div className="p-8 rounded-2xl border shadow-sm mb-8 relative overflow-hidden group"
                            style={{ 
                                backgroundColor: 'var(--card-bg)', 
                                borderColor: 'var(--card-border)',
                                backgroundImage: 'linear-gradient(to bottom right, var(--card-bg), var(--background))'
                            }}>
                            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80" style={{ color: 'var(--text-muted)' }}>{t('accumulatedEffort')}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">{totalPagesAccumulated.toLocaleString()}</span>
                                        <span className="text-xl font-medium" style={{ color: 'var(--text-muted)' }}>{t('pages')}</span>
                                    </div>
                                </div>
                                <div className="flex-1 max-w-xs space-y-3">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                        <span>{t('achievementPageSeeker')}</span>
                                        <span className="text-indigo-600 dark:text-indigo-400">{Math.min(100, Math.round((totalPagesAccumulated / 1000) * 100))}%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden border border-slate-200/50 dark:border-transparent">
                                        <div className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${Math.min(100, Math.round((totalPagesAccumulated / 1000) * 100))}%` }} />
                                    </div>
                                    <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{t('readPages').replace('{count}', String(Math.max(0, 1000 - totalPagesAccumulated)))} {t('toNextGoal')}</p>
                                </div>
                            </div>
                        </div>


                    </section>
                </div>

                <div className="space-y-6 md:space-y-10">
                    {/* 5. Achievements Section */}
                    <section className="space-y-6">
                        <h3 className="text-xl md:text-2xl font-black px-2 md:px-0" style={{ color: 'var(--text-primary)' }}>{t('achievements')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                            {achievements.map((ach) => (
                                <div key={ach.id} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${ach.condition ? 'shadow-sm opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0'}`}
                                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-sm ${ach.condition ? 'bg-slate-100 dark:bg-slate-800' : 'bg-gray-100'}`}>
                                        {ach.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{ach.title}</h4>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] font-bold uppercase tracking-widest leading-none" style={{ color: 'var(--text-muted)' }}>
                                                {ach.condition ? 'Unlocked' : 'Locked'}
                                            </p>
                                            <p className={`text-[11px] font-bold ${ach.condition ? 'text-indigo-600 dark:text-indigo-400' : ''}`} style={!ach.condition ? { color: 'var(--text-secondary)' } : {}}>
                                                {ach.requirement}
                                            </p>
                                            {!ach.condition && (
                                                <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden border border-slate-200/30 dark:border-transparent">
                                                    <div
                                                        className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-500"
                                                        style={{ width: `${Math.min(100, (ach.currentValue / ach.neededValue) * 100)}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 6. Reading Suggestions Section */}
                    <section className="p-8 rounded-2xl shadow-sm relative overflow-hidden border"
                        style={{ 
                            backgroundColor: 'var(--card-bg)', 
                            borderColor: 'var(--card-border)',
                            backgroundImage: 'linear-gradient(to bottom right, var(--card-bg), var(--background))'
                        }}>
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl" />
                        <div className="relative z-10 space-y-6">
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 shadow-sm rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-[#E2E8F0] dark:border-slate-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674a1 1 0 00.995-.858l.647-5.422a1 1 0 00-.914-1.114L9 9.5l-.266-.028a1 1 0 00-.914 1.114l.647 5.422a1 1 0 00.995.858z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22V17m-6-6h12M12 2v3m-5 1a9 9 0 009 9c0-.854-.116-1.68-.332-2.464" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('suggestions')}</h3>
                            <div className="space-y-4">
                                {unreadBooksCount > 0 && (
                                    <div className="p-4 rounded-xl border text-sm font-medium leading-relaxed shadow-sm"
                                        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                                        {t('tipUnread').replace('{count}', String(unreadBooksCount))}
                                    </div>
                                )}
                                <div className="p-4 rounded-xl border text-sm font-medium leading-relaxed shadow-sm"
                                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                                    {t('readSomethingNew')}
                                </div>
                                {booksReadCount > 0 && (
                                    <div className="p-4 rounded-xl border text-sm font-medium leading-relaxed shadow-sm"
                                        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                                        {t('tipCompleted').replace('{count}', String(booksReadCount))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Modals */}
            <UpdateProgressModal
                isOpen={isProgressModalOpen}
                onClose={() => {
                    setIsProgressModalOpen(false);
                    setSelectedBookForProgress(null);
                }}
                book={selectedBookForProgress}
            />

            {/* Yearly Goal Modal */}
            {isGoalModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-md animate-fade-in" onClick={() => setIsGoalModalOpen(false)} />
                    <div className="relative rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-zoom-in border"
                        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>{t('setReadingGoal')}</h2>
                                <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>{t('enterGoal')}</p>
                            </div>
                            <button onClick={() => setIsGoalModalOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors" style={{ color: 'var(--text-secondary)' }}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="relative">
                                <input
                                    type="number"
                                    value={tempGoal}
                                    onChange={(e) => setTempGoal(parseInt(e.target.value) || 0)}
                                    className="w-full rounded-[2rem] px-8 py-10 text-6xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all border"
                                    style={{ 
                                        backgroundColor: 'var(--background)', 
                                        borderColor: 'var(--card-border)',
                                        color: 'var(--text-primary)'
                                    }}
                                    placeholder="30"
                                    autoFocus
                                />
                                <div className="absolute right-8 top-1/2 -translate-y-1/2 font-semibold uppercase tracking-widest text-sm pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                                    {t('books')}
                                </div>
                            </div>

                            <button
                                onClick={saveGoal}
                                className="w-full font-semibold py-5 rounded-[1.5rem] shadow-xl transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                style={{ backgroundColor: 'var(--active-bg)', color: 'var(--active-text)' }}
                            >
                                {t('saveGoal')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
