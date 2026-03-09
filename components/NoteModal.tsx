'use client';

import { useState, useEffect } from 'react';
import { useBooks } from '@/context/BookContext';
import { Book } from '@/types/book';

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
}

export default function NoteModal({ isOpen, onClose, book }: NoteModalProps) {
    const { updateBook } = useBooks();
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (book) {
            setNote(book.note || '');
        }
    }, [book, isOpen]);

    const handleSave = async () => {
        if (!book) return;
        setIsSaving(true);
        try {
            await updateBook(book.id, { note });
            onClose();
        } catch (error) {
            console.error('Failed to save note:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !book) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    บันทึกโน้ต: {book.title}
                </h2>

                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full h-40 p-4 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                    placeholder="เขียนความรู้สึก หรือสิ่งที่ได้เรียนรู้จากหนังสือเล่มนี้..."
                />

                <div className="flex gap-3 pt-4 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                    </button>
                </div>
            </div>
        </div>
    );
}
