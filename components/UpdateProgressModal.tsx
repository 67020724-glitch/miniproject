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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [goalMet, setGoalMet] = useState(false);
    const [bookFinished, setBookFinished] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPagesToday('');
            setShowSuccess(false);
            setGoalMet(false);
            setBookFinished(false);
        }
    }, [isOpen]);

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
            const finalPagesRead = Math.min(newPagesRead, totalPages || Infinity);
            const isFinished = totalPages > 0 && finalPagesRead >= totalPages;

            const updates: Partial<Book> = {
                pagesRead: finalPagesRead,
            };

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
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Scrollable container */}
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div
                        className="relative transform bg-white rounded-2xl text-left shadow-xl transition-all w-full max-w-sm my-8 p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Success State */}
                        {showSuccess ? (
                            <div className="text-center py-6 space-y-4">
                                <div className="text-6xl animate-bounce">
                                    {bookFinished ? '🏆' : goalMet ? '🎉' : '✅'}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    {bookFinished
                                        ? t('bookCompleted')
                                        : goalMet
                                            ? t('goalCompleted')
                                            : t('updateSuccess')
                                    }
                                </h3>
                                {!bookFinished && totalPages > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>{newPagesRead} / {totalPages} {t('pages')}</span>
                                            <span>{newProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
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
                                        <h2 className="text-lg font-semibold text-gray-800 whitespace-nowrap">{t('updateProgress')}</h2>
                                        <p className="text-sm text-gray-500 line-clamp-1">{book.title}</p>
                                    </div>
                                </div>

                                {/* Current Progress */}
                                {totalPages > 0 && (
                                    <div className="mb-4 space-y-2">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>{t('progressLabel')}: {currentPagesRead} / {totalPages} {t('pages')}</span>
                                            <span>{currentProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="h-2.5 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${currentProgress}%`,
                                                    background: 'linear-gradient(90deg, #3b82f6, #6366f1)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Daily Goal Info */}
                                {pagesPerDay > 0 && (
                                    <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span>🎯</span>
                                            <span className="text-amber-700 font-medium">
                                                {t('todaysGoal')}: {t('readPages').replace('{count}', String(pagesPerDay))}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('pagesReadToday')}
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={totalPages > 0 ? totalPages - currentPagesRead : undefined}
                                            value={pagesToday}
                                            onChange={(e) => setPagesToday(e.target.value ? parseInt(e.target.value) : '')}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg text-center font-semibold"
                                            placeholder="0"
                                            autoFocus
                                        />
                                    </div>

                                    {/* Preview new progress */}
                                    {pagesToday && Number(pagesToday) > 0 && totalPages > 0 && (
                                        <div className="space-y-2 p-3 bg-blue-50 rounded-xl">
                                            <div className="flex justify-between text-sm text-blue-600">
                                                <span>{newPagesRead} / {totalPages} {t('pages')}</span>
                                                <span>{newProgress}%</span>
                                            </div>
                                            <div className="w-full bg-blue-100 rounded-full h-2.5">
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
                                            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                                        >
                                            {t('cancel')}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !pagesToday || Number(pagesToday) <= 0}
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                                        >
                                            {isSubmitting ? (
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : '📝'} {t('updateProgress')}
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
