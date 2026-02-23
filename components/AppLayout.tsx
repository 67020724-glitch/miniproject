'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Always show full layout with sidebar and topbar
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


