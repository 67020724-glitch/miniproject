export type BookSource = 'physical' | 'online' | 'pdf' | 'library' | 'other';

export interface Book {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    status: 'unread' | 'reading' | 'completed';
    isFavorite?: boolean;
    createdAt: Date;
    startedAt?: Date | null;
    completedAt?: Date | null;
    rating?: number | null;
    note?: string | null;
    category?: string | null;
    source?: BookSource | null;
    sourceUrl?: string | null;
    totalPages?: number | null;
    pagesPerDay?: number | null;
    pagesRead?: number | null;
}

export type BookStatus = 'unread' | 'reading' | 'completed';

