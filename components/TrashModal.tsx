'use client';

import { useState } from 'react';
import { useBooks } from '@/context/BookContext';
import { useLanguage } from '@/context/LanguageContext';

interface TrashModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
}

function ConfirmDialog({ isOpen, title, message, confirmText, cancelText, onConfirm, onCancel }: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 rounded-2xl">
            <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TrashModal({ isOpen, onClose }: TrashModalProps) {
    const { deletedBooks, restoreBook, permanentlyDeleteBook, clearTrash } = useBooks();
    const { t, language } = useLanguage();
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null); // book id to delete
    const [confirmClearAll, setConfirmClearAll] = useState(false);

    if (!isOpen) return null;

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handlePermanentDelete = (bookId: string) => {
        setConfirmDelete(bookId);
    };

    const confirmPermanentDelete = () => {
        if (confirmDelete) {
            permanentlyDeleteBook(confirmDelete);
            setConfirmDelete(null);
        }
    };

    const handleClearAll = () => {
        setConfirmClearAll(true);
    };

    const confirmClearAllAction = () => {
        clearTrash();
        setConfirmClearAll(false);
    };

    const bookToDelete = confirmDelete ? deletedBooks.find(b => b.id === confirmDelete) : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[80vh] mx-4 flex flex-col">
                {/* Confirm Delete Single Book */}
                <ConfirmDialog
                    isOpen={confirmDelete !== null}
                    title={t('confirmDelete')}
                    message={t('confirmDeleteMessage').replace('{title}', bookToDelete?.title || '')}
                    confirmText={t('permanentDelete')}
                    cancelText={t('cancel')}
                    onConfirm={confirmPermanentDelete}
                    onCancel={() => setConfirmDelete(null)}
                />

                {/* Confirm Clear All */}
                <ConfirmDialog
                    isOpen={confirmClearAll}
                    title={t('confirmClearTrash')}
                    message={t('confirmClearTrashMessage').replace('{count}', String(deletedBooks.length))}
                    confirmText={t('permanentDelete')}
                    cancelText={t('cancel')}
                    onConfirm={confirmClearAllAction}
                    onCancel={() => setConfirmClearAll(false)}
                />

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">{t('trash')}</h2>
                            <p className="text-sm text-gray-500">{deletedBooks.length} {t('items')}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {deletedBooks.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <p className="text-gray-500">{t('trashEmpty')}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {deletedBooks.map((book) => (
                                <div
                                    key={book.id}
                                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                                >
                                    {/* Book Cover */}
                                    <img
                                        src={book.coverUrl}
                                        alt={book.title}
                                        className="w-12 h-16 object-cover rounded-lg"
                                    />

                                    {/* Book Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-800 truncate">{book.title}</h3>
                                        <p className="text-sm text-gray-500 truncate">{book.author}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {t('deletedAt')} {formatDate(book.deletedAt)}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => restoreBook(book.id)}
                                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                            title={t('restore')}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handlePermanentDelete(book.id)}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                            title={t('permanentDelete')}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {deletedBooks.length > 0 && (
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleClearAll}
                            className="w-full py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
                        >
                            {t('clearTrash')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

