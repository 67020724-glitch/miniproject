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
    rating?: number;
    note?: string;
    category?: string;
}

export type BookStatus = 'unread' | 'reading' | 'completed';

