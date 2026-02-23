'use client';

import { useState } from 'react';
import { useBooks } from '@/context/BookContext';
import { useLanguage } from '@/context/LanguageContext';
import BookCard from '@/components/BookCard';
import EditBookModal from '@/components/EditBookModal';

import { Book } from '@/types/book';

export default function FavoritesPage() {
    const { getFavoriteBooks, deleteBook, updateBook, toggleFavorite } = useBooks();
    const { t } = useLanguage();
    const favoriteBooks = getFavoriteBooks();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBookForEdit, setSelectedBookForEdit] = useState<Book | null>(null);


    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{t('favorites')}</h1>

            {favoriteBooks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)' }}>
                        <svg className="w-8 h-8" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>{t('noFavorites')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {favoriteBooks.map((book) => (
                        <div key={book.id} className="relative group">
                            <BookCard
                                book={book}
                                size="medium"
                                onDelete={deleteBook}
                                onStatusChange={(id, status) => updateBook(id, { status })}
                                onRatingChange={(id, rating) => updateBook(id, { rating })}

                                onEdit={(book) => {
                                    setSelectedBookForEdit(book);
                                    setIsEditModalOpen(true);
                                }}
                                showActions
                            />
                            {/* Favorite badge */}
                            <button
                                onClick={() => toggleFavorite(book.id)}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                            >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>
                    ))}
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
