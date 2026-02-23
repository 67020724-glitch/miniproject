'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface ProfileMenuProps {
    onLogin: () => void;
    onRegister: () => void;
}

export default function ProfileMenu({ onLogin, onRegister }: ProfileMenuProps) {
    const { user, isLoggedIn, logout } = useAuth();
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors overflow-hidden"
            >
                {isLoggedIn && user ? (
                    user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-sm font-medium text-gray-700">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    )
                ) : (
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50">
                    {isLoggedIn && user ? (
                        <>
                            {/* User Info */}
                            <div className="px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium overflow-hidden">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{user.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                                <Link
                                    href="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{t('profile')}</span>
                                </Link>
                                <Link
                                    href="/settings"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{t('settings')}</span>
                                </Link>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-gray-100 py-2">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        logout();
                                    }}
                                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>{t('logout')}</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Guest Menu */}
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="font-medium text-gray-800">{t('welcome')}</p>
                                <p className="text-sm text-gray-500">{t('loginToManageLibrary')}</p>
                            </div>

                            <div className="p-3 space-y-2">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        onLogin();
                                    }}
                                    className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                >
                                    {t('login')}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        onRegister();
                                    }}
                                    className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    {t('register')}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

