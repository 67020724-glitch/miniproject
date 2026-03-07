'use client';

import { useState, useEffect } from 'react';
import { useBooks } from '@/context/BookContext';
import { Book } from '@/types/book';
import { useLanguage } from '@/context/LanguageContext';

interface UpdateProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
}

export default function UpdateProgressModal({ isOpen, onClose, book }: UpdateProgressModalProps) {
    const { t } = useLanguage();
    const { updateBook } = useBooks();
    const [pagesToday, setPagesToday] = useState<number | ''>('');
    const [totalP, setTotalP] = useState<number | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [goalMet, setGoalMet] = useState(false);
    const [bookFinished, setBookFinished] = useState(false);

    useEffect(() => {
        if (isOpen && book) {
            setPagesToday('');
            setTotalP(book.totalPages || '');
            setShowSuccess(false);
            setGoalMet(false);
            setBookFinished(false);
        }
    }, [isOpen, book]);

    if (!isOpen || !book) return null;

    const currentPagesRead = book.pagesRead || 0;
    const totalPages = book.totalPages || 0;
    const pagesPerDay = book.pagesPerDay || 0;
    const newPagesRead = currentPagesRead + (pagesToday ? Number(pagesToday) : 0);
    const newProgress = totalPages > 0
        ? Math.min(100, Math.round((newPagesRead / totalPages) * 100))
        : 0;
    const currentProgress = totalPages > 0
        ? Math.min(100, Math.round((currentPagesRead / totalPages) * 100))
        : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pagesToday || Number(pagesToday) <= 0) return;

        setIsSubmitting(true);
        try {
            const finalTotalPages = totalP !== '' ? Number(totalP) : (book.totalPages || 0);
            const finalPagesRead = Math.min(newPagesRead, finalTotalPages || Infinity);
            const isFinished = finalTotalPages > 0 && finalPagesRead >= finalTotalPages;

            const updates: Partial<Book> = {
                pagesRead: finalPagesRead,
            };

            if (totalP !== '' && totalP !== book.totalPages) {
                updates.totalPages = Number(totalP);
            }

            if (isFinished) {
                updates.status = 'completed';
            }

            await updateBook(book.id, updates);

            // Check if daily goal met
            if (pagesPerDay > 0 && Number(pagesToday) >= pagesPerDay) {
                setGoalMet(true);
            }
            if (isFinished) {
                setBookFinished(true);
            }
            setShowSuccess(true);

            // Auto-close after 2 seconds
            setTimeout(() => {
                onClose();
            }, 2500);
        } catch (error) {
            console.error('Error updating progress:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative z-50" aria-labelledby="progress-modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-indigo-900/10 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Scrollable container */}
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div
                        className="relative transform bg-white dark:bg-slate-800 rounded-2xl md:rounded-[2.5rem] text-left shadow-xl transition-all w-full max-w-sm my-4 md:my-8 p-5 md:p-8 border border-transparent dark:border-slate-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Success State */}
                        {showSuccess ? (
                            <div className="text-center py-6 space-y-4">
                                <div className="text-6xl animate-bounce">
                                    {bookFinished ? '🏆' : goalMet ? '🎉' : '✅'}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                    {bookFinished
                                        ? t('bookCompleted')
                                        : goalMet
                                            ? t('goalCompleted')
                                            : t('updateSuccess')
                                    }
                                </h3>
                                {!bookFinished && totalPages > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                            <span>{newPagesRead} / {totalPages} {t('pages')}</span>
                                            <span>{newProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                                            <div
                                                className="h-3 rounded-full transition-all duration-1000"
                                                style={{
                                                    width: `${newProgress}%`,
                                                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    {book.coverUrl && (
                                        <img
                                            src={book.coverUrl}
                                            alt={book.title}
                                            className="w-12 h-16 object-cover rounded-lg shadow-sm"
                                        />
                                    )}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">{t('updateProgress')}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{book.title}</p>
                                    </div>
                                </div>

                                {/* Current Progress */}
                                {totalPages > 0 && (
                                    <div className="mb-4 space-y-2">
                                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                            <span>{t('progressLabel')}: {currentPagesRead} / {totalPages} {t('pages')}</span>
                                            <span>{currentProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                                            <div
                                                className="h-2.5 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${currentProgress}%`,
                                                    background: 'linear-gradient(90deg, #4F46E5, #818CF8)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Daily Goal Info */}
                                {pagesPerDay > 0 && (
                                    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span>🎯</span>
                                            <span className="text-amber-700 dark:text-amber-400 font-medium">
                                                {t('todaysGoal')}: {t('readPages').replace('{count}', String(pagesPerDay))}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                                                {t('pagesReadToday')}
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={pagesToday}
                                                onChange={(e) => setPagesToday(e.target.value ? parseInt(e.target.value) : '')}
                                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg text-center font-bold text-gray-900 dark:text-white"
                                                placeholder="0"
                                                autoFocus
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                                                {t('totalPagesLabel')}
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={totalP}
                                                onChange={(e) => setTotalP(e.target.value ? parseInt(e.target.value) : '')}
                                                className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg text-center font-bold text-gray-900 dark:text-white ${!book.totalPages ? 'border-amber-300 dark:border-amber-500/50 bg-amber-50 dark:bg-amber-500/10 animate-pulse-slow' : 'border-gray-200 dark:border-slate-700'}`}
                                                placeholder="?"
                                            />
                                        </div>
                                    </div>

                                    {/* Preview new progress */}
                                    {pagesToday && Number(pagesToday) > 0 && totalPages > 0 && (
                                        <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                                            <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
                                                <span>{newPagesRead} / {totalPages} {t('pages')}</span>
                                                <span>{newProgress}%</span>
                                            </div>
                                            <div className="w-full bg-blue-100 dark:bg-slate-700 rounded-full h-2.5">
                                                <div
                                                    className="h-2.5 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${newProgress}%`,
                                                        background: newProgress >= 100
                                                            ? 'linear-gradient(90deg, #10b981, #059669)'
                                                            : 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                                                    }}
                                                />
                                            </div>
                                            {pagesPerDay > 0 && Number(pagesToday) >= pagesPerDay && (
                                                <p className="text-sm text-emerald-600 font-medium text-center">
                                                    🎉 {t('goalCompleted')}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Buttons */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            disabled={isSubmitting}
                                            className="flex-1 px-4 py-2 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                                        >
                                            {t('cancel')}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !pagesToday || Number(pagesToday) <= 0}
                                            className="flex-1 px-4 py-2 bg-[#4F46E5] text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
                                        >
                                            {isSubmitting ? (
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            )}
                                            {t('updateProgress')}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
