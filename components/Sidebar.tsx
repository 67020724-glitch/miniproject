'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

type MenuItemKey = 'home' | 'library' | 'bookStatus' | 'summary' | 'settings' | 'about' | 'favorites';

// Menu items with translation keys
const menuItems: { href: string; labelKey: MenuItemKey; icon: string }[] = [
    { href: '/', labelKey: 'home', icon: 'home' },
    { href: '/library', labelKey: 'library', icon: 'library' },
    { href: '/favorites', labelKey: 'favorites', icon: 'favorites' },
    { href: '/status', labelKey: 'bookStatus', icon: 'status' },
    { href: '/summary', labelKey: 'summary', icon: 'summary' },
];

// Menu items for guests (not logged in)
const guestMenuItems: { href: string; labelKey: MenuItemKey; icon: string }[] = [
    { href: '/', labelKey: 'home', icon: 'home' },
];

const bottomMenuItems: { href: string; labelKey: MenuItemKey; icon: string }[] = [
    { href: '/settings', labelKey: 'settings', icon: 'settings' },
    { href: '/about', labelKey: 'about', icon: 'about' },
];

const icons: Record<string, React.ReactNode> = {
    home: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    library: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    ),
    status: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    summary: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    settings: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    about: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    favorites: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    ),
};

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { isLoggedIn } = useAuth();
    const { t } = useLanguage();

    // Use different menu items based on login status
    const currentMenuItems = isLoggedIn ? menuItems : guestMenuItems;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 md:w-60 bg-white border-r flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--card-border)' }}
            >
                {/* Logo */}
                <div className="p-6 pb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-light italic" style={{ color: 'var(--text-muted)' }}>
                        Story<span className="font-normal" style={{ color: 'var(--text-primary)' }}>Nest</span>
                        <span className="text-sm align-top" style={{ color: 'var(--text-muted)' }}>+</span>
                    </h1>
                    {/* Close Button (Mobile Only) */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Main Menu */}
                <nav className="flex-1 px-3 overflow-y-auto">
                    <ul className="space-y-1">
                        {currentMenuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose} // Close sidebar on navigation on mobile
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-gray-700 text-white'
                                            : ''
                                            }`}
                                        style={!isActive ? { color: 'var(--text-secondary)' } : {}}
                                    >
                                        {icons[item.icon]}
                                        <span className="text-sm font-medium whitespace-nowrap">{t(item.labelKey)}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Bottom Menu */}
                <nav className="px-3 pb-6 mt-auto">
                    <ul className="space-y-1">
                        {bottomMenuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-gray-700 text-white'
                                            : ''
                                            }`}
                                        style={!isActive ? { color: 'var(--text-secondary)' } : {}}
                                    >
                                        {icons[item.icon]}
                                        <span className="text-sm font-medium whitespace-nowrap">{t(item.labelKey)}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </>
    );
}


