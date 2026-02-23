'use client';

import { useState } from 'react';
import { useBooks } from '@/context/BookContext';
import { useLanguage } from '@/context/LanguageContext';
import BookCard from '@/components/BookCard';
import EditBookModal from '@/components/EditBookModal';
import NoteModal from '@/components/NoteModal';
import { Book, BookStatus } from '@/types/book';

type TabType = 'all' | BookStatus;

type TabKey = 'all' | 'reading' | 'completed' | 'unread';

const tabKeys: { key: TabType; labelKey: TabKey }[] = [
    { key: 'all', labelKey: 'all' },
    { key: 'reading', labelKey: 'reading' },
    { key: 'completed', labelKey: 'completed' },
    { key: 'unread', labelKey: 'unread' },
];

export default function StatusPage() {
    const { books, getBooksByStatus, deleteBook, updateBook, toggleFavorite } = useBooks();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBookForEdit, setSelectedBookForEdit] = useState<Book | null>(null);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [selectedBookForNote, setSelectedBookForNote] = useState<Book | null>(null);

    const filteredBooks = activeTab === 'all' ? books : getBooksByStatus(activeTab);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{t('bookStatus')}</h1>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
                {tabKeys.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab.key
                            ? 'bg-gray-700 text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        {t(tab.labelKey)}
                        <span className="ml-2 text-xs">
                            ({tab.key === 'all' ? books.length : getBooksByStatus(tab.key as BookStatus).length})
                        </span>
                    </button>
                ))}
            </div>

            {/* Book Grid */}
            {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredBooks.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            size="medium"
                            showActions={true}
                            showYear={true}
                            onDelete={deleteBook}
                            onStatusChange={(id, status) => updateBook(id, { status })}
                            onRatingChange={(id, rating) => updateBook(id, { rating })}
                            onEditNote={(book) => {
                                setSelectedBookForNote(book);
                                setIsNoteModalOpen(true);
                            }}
                            onEdit={(book) => {
                                setSelectedBookForEdit(book);
                                setIsEditModalOpen(true);
                            }}
                            onFavorite={toggleFavorite}
                        />
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>{t('noBooksInCategory')}</p>
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

            {/* Note Modal */}
            <NoteModal
                isOpen={isNoteModalOpen}
                onClose={() => {
                    setIsNoteModalOpen(false);
                    setSelectedBookForNote(null);
                }}
                book={selectedBookForNote}
            />
        </div>
    );
}
