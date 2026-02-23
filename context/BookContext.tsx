'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, BookStatus } from '@/types/book';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';

interface DeletedBook extends Book {
    deletedAt: Date;
}

interface BookContextType {
    books: Book[];
    deletedBooks: DeletedBook[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredBooks: Book[];
    addBook: (book: Omit<Book, 'id' | 'createdAt'>) => Promise<void>;
    updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
    deleteBook: (id: string) => Promise<void>;
    restoreBook: (id: string) => Promise<void>;
    permanentlyDeleteBook: (id: string) => Promise<void>;
    clearTrash: () => Promise<void>;
    getBooksByStatus: (status: BookStatus) => Book[];
    searchBooks: (query: string) => Book[];
    getBooksByAuthor: (author: string) => Book[];
    authors: string[];
    toggleFavorite: (id: string) => Promise<void>;
    getFavoriteBooks: () => Book[];
    isLoading: boolean;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [deletedBooks, setDeletedBooks] = useState<DeletedBook[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch books from Supabase when user changes
    useEffect(() => {
        if (user) {
            fetchBooks();
        } else {
            setBooks([]);
            setDeletedBooks([]);
            setIsInitialized(true);
        }
    }, [user]);

    const fetchBooks = async () => {
        setIsLoading(true);
        try {
            // Fetch active books (deleted_at is null)
            const { data: activeData, error: activeError } = await supabase
                .from('books')
                .select('*')
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (activeError) throw activeError;

            // Fetch deleted books (deleted_at is not null)
            const { data: deletedData, error: deletedError } = await supabase
                .from('books')
                .select('*')
                .not('deleted_at', 'is', null)
                .order('deleted_at', { ascending: false });

            if (deletedError) throw deletedError;

            // Map and set state
            const mappedBooks: Book[] = (activeData || []).map(mapSupabaseBook);
            const mappedDeletedBooks: DeletedBook[] = (deletedData || []).map((b: any) => ({
                ...mapSupabaseBook(b),
                deletedAt: new Date(b.deleted_at),
            }));

            setBooks(mappedBooks);
            setDeletedBooks(mappedDeletedBooks);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setIsLoading(false);
            setIsInitialized(true);
        }
    };

    // Subscribe to realtime changes
    // Subscribe to realtime changes
    // Subscribe to realtime changes
    // Subscribe to realtime changes
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel(`books_realtime_${user.id}`) // Unique channel per user
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'books',
                    // Removed filter string to rely on RLS and manual filtering for robustness
                },
                async (payload) => {
                    const newRecord = payload.new as any;
                    const oldRecord = payload.old as any;
                    const id = newRecord?.id || oldRecord?.id;
                    if (!id) return;

                    if (payload.eventType === 'DELETE') {
                        setBooks((prev) => prev.filter((b) => b.id !== id));
                        setDeletedBooks((prev) => prev.filter((b) => b.id !== id));
                        return;
                    }

                    // Check ownership (RLS check proxy)
                    if (newRecord.user_id && newRecord.user_id !== user.id) return;

                    let finalBook: Book | undefined;

                    // Try to find existing book to update
                    const existingBook = books.find(b => b.id === id) || deletedBooks.find(b => b.id === id);

                    if (payload.eventType === 'UPDATE' && existingBook) {
                        // Optimistically merge
                        finalBook = {
                            ...existingBook,
                            title: newRecord.title !== undefined ? newRecord.title : existingBook.title,
                            author: newRecord.author !== undefined ? newRecord.author : existingBook.author,
                            coverUrl: newRecord.cover_url !== undefined ? newRecord.cover_url : existingBook.coverUrl,
                            status: newRecord.status !== undefined ? newRecord.status : existingBook.status,
                            isFavorite: newRecord.is_favorite !== undefined ? newRecord.is_favorite : existingBook.isFavorite,
                            category: newRecord.category !== undefined ? newRecord.category : existingBook.category,
                            rating: newRecord.rating !== undefined ? newRecord.rating : existingBook.rating,
                            note: newRecord.note !== undefined ? newRecord.note : existingBook.note,
                            startedAt: newRecord.started_at ? new Date(newRecord.started_at) : (newRecord.started_at === null ? undefined : existingBook.startedAt),
                            completedAt: newRecord.completed_at ? new Date(newRecord.completed_at) : (newRecord.completed_at === null ? undefined : existingBook.completedAt),
                        };
                    } else if (payload.eventType === 'INSERT') {
                        // INSERT usually comes with full data
                        finalBook = mapSupabaseBook(newRecord);
                    } else {
                        // UPDATE but we don't have it, or fallback. Fetch to ensure data.
                        const { data, error } = await supabase.from('books').select('*').eq('id', id).single();
                        if (data && !error) {
                            finalBook = mapSupabaseBook(data);
                        }
                    }

                    if (!finalBook) return;

                    // Handle State Management (Active vs Trash)
                    const isDeleted = !!newRecord.deleted_at;
                    const deletedAtDate = isDeleted ? new Date(newRecord.deleted_at) : undefined;

                    if (isDeleted) {
                        // Move to Trash
                        setBooks((prev) => prev.filter((b) => b.id !== id));
                        setDeletedBooks((prev) => {
                            const exists = prev.some((b) => b.id === id);
                            // Need to cast finalBook because we are adding deletedAt
                            const bookWithDelete = { ...finalBook!, deletedAt: deletedAtDate! } as DeletedBook;
                            if (exists) return prev.map((b) => b.id === id ? bookWithDelete : b);
                            return [bookWithDelete, ...prev];
                        });
                    } else {
                        // Move to Active
                        setDeletedBooks((prev) => prev.filter((b) => b.id !== id));
                        setBooks((prev) => {
                            const exists = prev.some((b) => b.id === id);
                            if (exists) return prev.map((b) => b.id === id ? finalBook! : b);
                            return [finalBook!, ...prev];
                        });
                    }
                }
            )
            .subscribe((status) => {
                console.log(`Realtime subscription status: ${status}`);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    // Helper to map Supabase columns to our Book type
    const mapSupabaseBook = (data: any): Book => ({
        id: data.id,
        title: data.title,
        author: data.author,
        coverUrl: data.cover_url || '',
        status: data.status as BookStatus,
        isFavorite: data.is_favorite,
        category: data.category,
        createdAt: new Date(data.created_at),
        startedAt: data.started_at ? new Date(data.started_at) : undefined,
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
        rating: data.rating || 0,
        note: data.note || '',
    });

    // Filter books based on search query
    const filteredBooks = searchQuery.trim()
        ? books.filter(
            (book) =>
                book.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : books;

    const addBook = async (bookData: Omit<Book, 'id' | 'createdAt'>) => {
        if (!user) return;
        try {
            const now = new Date().toISOString();
            const insertData: any = {
                user_id: user.id,
                title: bookData.title,
                author: bookData.author,
                cover_url: bookData.coverUrl,
                status: bookData.status,
                category: bookData.category,
                is_favorite: bookData.isFavorite,
                rating: bookData.rating,
                deleted_at: null,
            };

            if (bookData.status === 'reading') {
                insertData.started_at = bookData.startedAt ? bookData.startedAt.toISOString() : now;
            } else if (bookData.status === 'completed') {
                insertData.completed_at = bookData.completedAt ? bookData.completedAt.toISOString() : now;
                if (bookData.startedAt) {
                    insertData.started_at = bookData.startedAt.toISOString();
                }
            }

            const { data, error } = await supabase
                .from('books')
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;
            setBooks((prev) => [mapSupabaseBook(data), ...prev]);
        } catch (error: any) {
            console.error('Error adding book:', error.message || error);
            console.error('Full Error Details:', JSON.stringify(error, null, 2));
        }
    };

    const updateBook = async (id: string, updates: Partial<Book>) => {
        try {
            const updateData: any = {};
            const localUpdates: Partial<Book> = { ...updates };
            const now = new Date();

            if (updates.title !== undefined) updateData.title = updates.title;
            if (updates.author !== undefined) updateData.author = updates.author;

            if (updates.status !== undefined) {
                updateData.status = updates.status;

                // Set dates based on status
                if (updates.status === 'reading') {
                    updateData.started_at = now.toISOString();
                    updateData.completed_at = null; // Reset completed date
                    localUpdates.startedAt = now;
                    localUpdates.completedAt = null;
                } else if (updates.status === 'completed') {
                    updateData.completed_at = now.toISOString();
                    localUpdates.completedAt = now;
                    // Don't overwrite started_at if it exists
                } else if (updates.status === 'unread') {
                    updateData.started_at = null;
                    updateData.completed_at = null;
                    localUpdates.startedAt = null;
                    localUpdates.completedAt = null;
                }
            }

            if (updates.coverUrl !== undefined) updateData.cover_url = updates.coverUrl;
            if (updates.isFavorite !== undefined) updateData.is_favorite = updates.isFavorite;
            if (updates.rating !== undefined) updateData.rating = updates.rating;
            if (updates.note !== undefined) updateData.note = updates.note;

            const { error } = await supabase
                .from('books')
                .update(updateData)
                .eq('id', id);

            if (error) throw error;

            // Optimistically update local state immediately
            setBooks((prev) =>
                prev.map((book) => (book.id === id ? { ...book, ...localUpdates } : book))
            );
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const deleteBook = async (id: string) => {
        try {
            const deletedAt = new Date().toISOString();
            const { error } = await supabase
                .from('books')
                .update({ deleted_at: deletedAt })
                .eq('id', id);

            if (error) throw error;

            const bookToDelete = books.find((book) => book.id === id);
            if (bookToDelete) {
                const deletedBook: DeletedBook = {
                    ...bookToDelete,
                    deletedAt: new Date(deletedAt),
                };
                setDeletedBooks((prev) => [deletedBook, ...prev]);
                setBooks((prev) => prev.filter((book) => book.id !== id));
            }
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const restoreBook = async (id: string) => {
        try {
            const { error } = await supabase
                .from('books')
                .update({ deleted_at: null })
                .eq('id', id);

            if (error) throw error;

            const bookToRestore = deletedBooks.find((book) => book.id === id);
            if (bookToRestore) {
                const { deletedAt, ...restoredBook } = bookToRestore;
                setBooks((prev) => [restoredBook, ...prev]);
                setDeletedBooks((prev) => prev.filter((book) => book.id !== id));
            }
        } catch (error) {
            console.error('Error restoring book:', error);
        }
    };

    const permanentlyDeleteBook = async (id: string) => {
        try {
            const { error } = await supabase
                .from('books')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setDeletedBooks((prev) => prev.filter((book) => book.id !== id));
        } catch (error) {
            console.error('Error permanently deleting book:', error);
        }
    };

    const clearTrash = async () => {
        try {
            // Find all IDs in deletedBooks
            const ids = deletedBooks.map(b => b.id);
            if (ids.length === 0) return;

            const { error } = await supabase
                .from('books')
                .delete()
                .in('id', ids);

            if (error) throw error;

            setDeletedBooks([]);
        } catch (error) {
            console.error('Error clearing trash:', error);
        }
    };

    const getBooksByStatus = (status: BookStatus) => {
        return books.filter((book) => book.status === status);
    };

    const searchBooks = (query: string) => {
        const lowercaseQuery = query.toLowerCase();
        return books.filter(
            (book) =>
                book.title.toLowerCase().includes(lowercaseQuery) ||
                book.author.toLowerCase().includes(lowercaseQuery)
        );
    };

    const getBooksByAuthor = (authorName: string) => {
        return books.filter((book) => book.author === authorName);
    };

    const authors = Array.from(new Set(books.map(b => b.author))).sort();

    const toggleFavorite = async (id: string) => {
        const book = books.find(b => b.id === id);
        if (book) {
            await updateBook(id, { isFavorite: !book.isFavorite });
        }
    };

    const getFavoriteBooks = () => {
        return books.filter((book) => book.isFavorite);
    };

    return (
        <BookContext.Provider
            value={{
                books,
                deletedBooks,
                searchQuery,
                setSearchQuery,
                filteredBooks,
                addBook,
                updateBook,
                deleteBook,
                restoreBook,
                permanentlyDeleteBook,
                clearTrash,
                getBooksByStatus,
                searchBooks,
                getBooksByAuthor,
                authors,
                toggleFavorite,
                getFavoriteBooks,
                isLoading
            }}
        >
            {children}
        </BookContext.Provider>
    );
}

export function useBooks() {
    const context = useContext(BookContext);
    if (context === undefined) {
        throw new Error('useBooks must be used within a BookProvider');
    }
    return context;
}


