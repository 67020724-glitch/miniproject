'use client';

import { useState } from 'react';
import { useBooks } from '@/context/BookContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import TrashModal from './TrashModal';
import ProfileMenu from './ProfileMenu';
import AuthModal from './AuthModal';

interface TopbarProps {
    onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
    const { searchQuery, setSearchQuery, deletedBooks } = useBooks();
    const { isLoggedIn } = useAuth();
    const { t } = useLanguage();
    const [isTrashOpen, setIsTrashOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            // Search happens automatically via filteredBooks
        }
    };

    return (
        <>
            <header className="relative z-30 h-16 border-b flex items-center px-4 md:px-6 gap-3" style={{ backgroundColor: 'var(--topbar-bg)', borderColor: 'var(--card-border)' }}>
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden w-10 h-10 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    aria-label="Menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Mobile Brand - Hidden to show search bar */}
                <div className="hidden font-light italic text-lg" style={{ color: 'var(--text-muted)' }}>
                    Story<span className="font-normal" style={{ color: 'var(--text-primary)' }}>Nest</span>
                </div>

                {/* Search - Always visible */}
                {isLoggedIn ? (
                    <div className="flex items-center gap-2 flex-1 md:w-[400px] md:flex-none">
                        <div className="flex items-center flex-1 border rounded-full px-3 py-2 md:px-4" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}>
                            <svg
                                className="w-5 h-5 mr-2"
                                style={{ color: 'var(--text-muted)' }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder={t('searchBooks')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 outline-none text-sm bg-transparent"
                                style={{ color: 'var(--text-primary)' }}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <button
                            className="hidden md:block px-6 py-2 bg-gray-700 text-white text-sm rounded-full hover:bg-gray-800 transition-colors flex-shrink-0"
                        >
                            {t('search')}
                        </button>
                    </div>
                ) : (
                    <div className="hidden md:block flex-shrink-0">
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('welcome')}</span>
                    </div>
                )}

                {/* Spacer */}
                <div className="flex-1"></div>

                {/* Icons - Fixed position on right */}
                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                    {/* Profile Menu */}
                    <ProfileMenu
                        onLogin={() => setAuthMode('login')}
                        onRegister={() => setAuthMode('register')}
                    />

                    {/* Trash Icon - Only show when logged in */}
                    {isLoggedIn && (
                        <button
                            onClick={() => setIsTrashOpen(true)}
                            className="relative w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            {/* Badge for deleted count */}
                            {deletedBooks.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {deletedBooks.length > 9 ? '9+' : deletedBooks.length}
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </header>

            {/* Trash Modal */}
            <TrashModal isOpen={isTrashOpen} onClose={() => setIsTrashOpen(false)} />

            {/* Auth Modal */}
            <AuthModal
                isOpen={authMode !== null}
                onClose={() => setAuthMode(null)}
                initialMode={authMode || 'login'}
            />
        </>
    );
}

