'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isLoggedIn, isLoading } = useAuth();

    // While loading auth state, show a clean background
    if (isLoading) {
        return <div className="h-screen w-full" style={{ backgroundColor: 'var(--background)' }}></div>;
    }

    // If not logged in, show only the main content (WelcomePage/Auth)
    // without sidebar and topbar for a full-screen experience
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen w-full overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
                {children}
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
            {/* Sidebar - stays fixed */}
            <Sidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar - stays fixed */}
                <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />

                {/* Page Content - only this scrolls */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}


