'use client';

import { useState } from 'react';
import { Book } from '@/types/book';
import { useLanguage } from '@/context/LanguageContext';

interface BookCardProps {
    book: Book;
    size?: 'small' | 'medium' | 'large';
    onDelete?: (id: string) => void;
    onStatusChange?: (id: string, status: Book['status']) => void;
    onRatingChange?: (id: string, rating: number) => void;
    onEditNote?: (book: Book) => void;
    onEdit?: (book: Book) => void;
    onFavorite?: (id: string) => void;
    showActions?: boolean;
    showYear?: boolean;
}

export default function BookCard({
    book,
    size = 'medium',
    onDelete,
    onStatusChange,
    onRatingChange,
    onEditNote,
    onEdit,
    onFavorite,
    showActions = false,
    showYear = false,
}: BookCardProps) {
    const { t, language } = useLanguage();
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    const widthClasses = {
        small: 'w-20',
        medium: 'w-32',
        large: 'w-40',
    };

    const heightClasses = {
        small: 'h-28',
        medium: 'h-44',
        large: 'h-56',
    };

    const statusColors = {
        unread: 'bg-gray-100 text-gray-600',
        reading: 'bg-blue-100 text-blue-600',
        completed: 'bg-green-100 text-green-600',
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <button
                    key={i}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRatingChange?.(book.id, i);
                    }}
                    className={`w-5 h-5 transition-colors ${(book.rating || 0) >= i ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                        }`}
                >
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            );
        }
        return <div className="flex gap-0.5">{stars}</div>;
    };

    return (
        <div
            className={`group relative flex flex-col items-center ${widthClasses[size]}`}
            onClick={() => setIsOverlayOpen(!isOverlayOpen)}
        >
            {/* Favorite Button - Always visible, floating outside */}
            {onFavorite && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onFavorite(book.id);
                    }}
                    className={`absolute -top-2 -right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${book.isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-400 hover:text-red-500 border border-gray-100'
                        }`}
                >
                    <svg
                        className="w-4 h-4"
                        fill={book.isFavorite ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            )}

            {/* Book Cover */}
            <div
                className={`w-full ${heightClasses[size]} relative rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer`}
            >
                <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                />

                {/* Hover Overlay - Click to toggle on mobile, hover on desktop */}
                {showActions && (
                    <div className={`absolute inset-0 z-10 bg-black/60 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 p-2 ${isOverlayOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
                        }`}>


                        {/* Status Change Buttons */}
                        <select
                            value={book.status}
                            onChange={(e) => onStatusChange?.(book.id, e.target.value as Book['status'])}
                            className="w-full px-2 py-1 text-xs rounded bg-white text-gray-700 cursor-pointer focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <option value="unread">{t('unread')}</option>
                            <option value="reading">{t('reading')}</option>
                            <option value="completed">{t('completed')}</option>
                        </select>

                        {/* Edit Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(book);
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center justify-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {t('editBook')}
                        </button>

                        {/* Note Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditNote?.(book);
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                            {t('addNote')}
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(book.id);
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                            {t('moveToTrash')}
                        </button>
                    </div>
                )}
            </div>

            {/* Book Info */}
            {size !== 'small' && (
                <div className="mt-2 w-full flex flex-col items-center gap-1">
                    <p className="text-xs font-medium line-clamp-2 text-center" style={{ color: 'var(--text-primary)' }}>
                        {book.title}
                    </p>



                    {/* Date Display */}
                    {book.status === 'reading' && book.startedAt && (
                        <p className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-500
                            bg-blue-100 text-black 
                            dark:bg-blue-800 dark:text-white shadow-sm">
                            {t('started')}: {new Date(book.startedAt).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short', year: showYear ? '2-digit' : undefined })}
                        </p>
                    )}
                    {book.status === 'completed' && book.completedAt && (
                        <p className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-green-300 dark:border-green-500
                            bg-green-100 text-black
                            dark:bg-green-800 dark:text-white shadow-sm">
                            {t('finished')}: {new Date(book.completedAt).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short', year: showYear ? '2-digit' : undefined })}
                        </p>
                    )}



                    {/* Note Preview */}
                    {book.note && (
                        <div className="mt-1 px-2 w-full">
                            <p className="text-[10px] text-gray-500 line-clamp-1 text-center bg-gray-50 rounded px-1" title={book.note}>
                                📝 {book.note}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

