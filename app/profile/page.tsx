'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

export default function ProfilePage() {
    const { user, updateProfile, isLoading: isAuthLoading } = useAuth();
    const { t } = useLanguage();

    const [name, setName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setAvatarUrl(user.avatar_url || '');
        }
    }, [user]);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setMessage(null);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('ต้องเลือกรูปภาพเพื่ออัปโหลด');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Supabase upload error object:', uploadError);
                if (uploadError.message.includes('bucket not found') || uploadError.message.includes('Bucket not found')) {
                    throw new Error('ไม่พบ Bucket ชื่อ "avatars" กรุณาสร้าง Bucket นี้ใน Supabase Storage');
                }
                if (uploadError.message.includes('New row violates row level security policy')) {
                    throw new Error('ติดปัญหา RLS Policy: คุณต้องเพิ่มนโยบายให้ผู้ใช้สามารถอัปโหลดไฟล์ได้ใน Supabase SQL Editor');
                }
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(data.publicUrl);
            await updateProfile({ avatar_url: data.publicUrl });
            setMessage({ type: 'success', text: t('profileUpdated') });
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            setMessage({ type: 'error', text: error.message || t('profileUpdateError') });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            const result = await updateProfile({ name });
            if (result.success) {
                setMessage({ type: 'success', text: t('profileUpdated') });
            } else {
                setMessage({ type: 'error', text: result.error || t('profileUpdateError') });
            }
        } catch (error) {
            setMessage({ type: 'error', text: t('profileUpdateError') });
        } finally {
            setIsSaving(false);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <p className="text-lg text-gray-600">{t('loginToManageLibrary')}</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>{t('profile')}</h1>
            </div>

            <div className="rounded-2xl border p-8 space-y-8 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white text-4xl font-semibold">
                                    {name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                            <span className="text-sm font-medium">{uploading ? '...' : t('changeAvatar')}</span>
                        </label>
                    </div>
                    {(uploading || isSaving) && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {message.text}

                            {message.type === 'error' && (
                                <div className="mt-4 p-4 bg-white border border-red-200 rounded-lg text-gray-700">
                                    <p className="font-bold mb-2">วิธีแก้ปัญหา Supabase Storage:</p>
                                    <ol className="list-decimal ml-4 space-y-2 text-xs">
                                        <li>สร้าง Bucket ชื่อ <code className="bg-gray-100 px-1 rounded">avatars</code> และตั้งเป็น <strong>Public</strong></li>
                                        <li>ไปที่ <strong>SQL Editor</strong> และรันคำสั่งนี้เพื่อตั้งค่าสิทธิ์ (RLS):</li>
                                    </ol>
                                    <pre className="mt-2 p-2 bg-gray-800 text-gray-100 text-[10px] rounded overflow-x-auto">
                                        {`insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using (bucket_id = 'avatars');

drop policy if exists "Auth Upload" on storage.objects;
create policy "Auth Upload" on storage.objects for insert with check (bucket_id = 'avatars' AND auth.role() = 'authenticated');`}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                            {t('nameLabel')}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-700 focus:outline-none transition-all"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                            placeholder={t('namePlaceholder')}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                            {t('emailLabel')}
                        </label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                            style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--card-border)' }}
                        />
                        <p className="mt-1.5 text-xs text-gray-500 italic">อีเมลไม่สามารถแก้ไขได้</p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSaving || uploading}
                            className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${isSaving || uploading ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-gray-700 hover:bg-gray-800 text-white active:scale-[0.98]'}`}
                        >
                            {isSaving && (
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isSaving ? t('processing') : t('updateProfile')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
