'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
    const { t } = useLanguage();

    // ฟังก์ชันสำหรับแชร์เนื้อหา
    const handleShare = async () => {
        const shareData = {
            title: 'StoryNest',
            text: t('aboutDescription'),
            url: typeof window !== 'undefined' ? window.location.href : '',
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {t('about')}
            </h1>

            <div className="rounded-2xl border p-8" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="max-w-lg">
                    {/* Logo & Share Button */}
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-light italic" style={{ color: 'var(--text-muted)' }}>
                            Story<span className="font-normal" style={{ color: 'var(--text-primary)' }}>Nest</span>
                            <span className="text-lg align-top" style={{ color: 'var(--text-muted)' }}>+</span>
                        </h2>
                        
                        {/* ปุ่มแชร์เพิ่มเข้ามาใหม่ */}
                        <button 
                            onClick={handleShare}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            title="Share"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3