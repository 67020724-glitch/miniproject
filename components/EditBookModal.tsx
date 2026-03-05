'use client';

import { useState, useEffect } from 'react';
import { useBooks } from '@/context/BookContext';
import { Book, BookStatus, BookSource } from '@/types/book';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/context/LanguageContext';

interface EditBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
}

// Helper to compress image
const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                        const newFile = new File([blob], newName, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(newFile);
                    } else {
                        reject(new Error('Canvas is empty'));
                    }
                }, 'image/jpeg', 0.7);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

export default function EditBookModal({ isOpen, onClose, book }: EditBookModalProps) {
    const { t } = useLanguage();
    const { updateBook } = useBooks();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<BookStatus>('unread');
    const [rating, setRating] = useState(0);
    const [note, setNote] = useState('');
    const [source, setSource] = useState<BookSource | ''>('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [totalPages, setTotalPages] = useState<number | ''>('');
    const [pagesPerDay, setPagesPerDay] = useState<number | ''>('');
    const [pagesRead, setPagesRead] = useState<number | ''>('');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    // Calculate estimated days
    const remaining = (totalPages ? Number(totalPages) : 0) - (pagesRead ? Number(pagesRead) : 0);
    const estimatedDays = remaining > 0 && pagesPerDay && Number(pagesPerDay) > 0
        ? Math.ceil(remaining / Number(pagesPerDay))
        : null;
    const progressPercent = totalPages && Number(totalPages) > 0
        ? Math.min(100, Math.round(((pagesRead ? Number(pagesRead) : 0) / Number(totalPages)) * 100))
        : 0;

    // Populate form when book changes
    useEffect(() => {
        if (book && isOpen) {
            setTitle(book.title || '');
            setAuthor(book.author || '');
            setCategory(book.category || '');
            setCoverUrl(book.coverUrl || '');
            setPreviewUrl(book.coverUrl || '');
            setCoverFile(null);
            setIsUploading(false);
            setShowCategoryDropdown(false);
            setStatus(book.status || 'unread');
            setRating(book.rating || 0);
            setNote(book.note || '');
            setSource(book.source || '');
            setSourceUrl(book.sourceUrl || '');
            setTotalPages(book.totalPages || '');
            setPagesPerDay(book.pagesPerDay || '');
            setPagesRead(book.pagesRead || '');
        }
    }, [book, isOpen]);

    const { books } = useBooks();
    // Get unique categories from all books for the dropdown
    const existingCategories = Array.from(new Set(books.map(b => b.category).filter(Boolean))) as string[];
    const defaultCategories = [
        t('catFiction'), t('catSelfHelp'), t('catBusiness'),
        t('catTechnology'), t('catHistory'), t('catFinance'), t('catPsychology')
    ];
    const allCategorySuggestions = Array.from(new Set([...defaultCategories, ...existingCategories]));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                alert(t('fileSizeLimit'));
                return;
            }
            setCoverFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setCoverUrl('');
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            if (!file) return null;

            let fileToUpload = file;
            try {
                const compressedFile = await compressImage(file);
                fileToUpload = compressedFile;
            } catch (err) {
                console.warn('Image compression failed, uploading original:', err);
            }

            const fileExt = fileToUpload.name.split('.').pop() || 'jpg';
            const baseName = fileToUpload.name.substring(0, fileToUpload.name.lastIndexOf('.')).replace(/[^a-zA-Z0-9]/g, '_') || 'image';
            const fileName = `${Date.now()}_${baseName}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('book-covers')
                .upload(filePath, fileToUpload, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Supabase upload error:', uploadError);
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('book-covers')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Upload error details:', error);
            alert(t('uploadFailed'));
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!book || !title.trim()) return;

        setIsUploading(true);
        try {
            let finalCoverUrl = coverUrl.trim();

            // 1. Handle file upload if present
            if (coverFile) {
                console.log('Uploading new cover image...');
                const uploadedUrl = await uploadImage(coverFile);
                if (uploadedUrl) {
                    finalCoverUrl = uploadedUrl;
                } else {
                    setIsUploading(false);
                    return; // Alert is already shown in uploadImage
                }
            }

            // 2. Fallback to placeholder if everything is empty
            if (!finalCoverUrl) {
                finalCoverUrl = `https://placehold.co/150x200/374151/ffffff?text=${encodeURIComponent(title.charAt(0).toUpperCase())}`;
            }

            console.log('Sending update to context:', { title, finalCoverUrl });

            // ส่งข้อมูลไปยัง Context เพื่ออัปเดตฐานข้อมูล (Supabase)
            await updateBook(book.id, {
                title: title.trim(),
                author: author.trim() || 'Unknown',
                category: category.trim() || null,
                coverUrl: finalCoverUrl,
                status,
                rating: rating || 0,
                note: note.trim() || null,
                source: source || null,
                sourceUrl: sourceUrl.trim() || null,
                totalPages: totalPages !== '' ? Number(totalPages) : null,
                pagesPerDay: pagesPerDay !== '' ? Number(pagesPerDay) : null,
                pagesRead: pagesRead !== '' ? Number(pagesRead) : 0,
            });

            onClose();
        } catch (error: any) {
            console.error('Submit handle error:', error);
            const errorMsg = error.message || error.details || JSON.stringify(error);
            alert(`${t('saveFailed')}\n\nError: ${errorMsg}`);
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen || !book) return null;

    return (
        <div className="relative z-50" aria-labelledby="edit-modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Scrollable container */}
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div
                        className="relative transform bg-white rounded-2xl text-left shadow-xl transition-all w-full max-w-md my-8 p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('editBookTitle')}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('titleLabel')}
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    placeholder={t('titlePlaceholder')}
                                    required
                                />
                            </div>

                            {/* Author */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('authorLabel')}
                                </label>
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    placeholder={t('authorPlaceholder')}
                                />
                            </div>

                            {/* Category */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('categoryLabel')}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => {
                                            setCategory(e.target.value);
                                            setShowCategoryDropdown(true);
                                        }}
                                        onFocus={() => setShowCategoryDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        placeholder={t('categoryPlaceholder')}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                {showCategoryDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                        {allCategorySuggestions
                                            .filter(c => c.toLowerCase().includes(category.toLowerCase()))
                                            .map((cat, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-sm text-gray-700"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault(); // Prevent blur before click
                                                        setCategory(cat);
                                                        setShowCategoryDropdown(false);
                                                    }}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('ratingLabel')}
                                </label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(rating === star ? 0 : star)}
                                            className={`w-8 h-8 transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cover Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('coverLabel')}
                                </label>

                                <div className="space-y-3">
                                    {/* File Input */}
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        {previewUrl ? (
                                            <div className="relative h-48 w-32 mx-auto pointer-events-none">
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover rounded-md shadow-sm"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                                                    <span className="text-white text-sm font-medium">{t('changeImage')}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-sm text-gray-500">{t('uploadImage')}</p>
                                                <p className="text-xs text-gray-400">{t('dragDrop')}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider with Text */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">{t('orUrl')}</span>
                                        </div>
                                    </div>

                                    {/* URL Input */}
                                    <input
                                        type="url"
                                        value={coverUrl}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setCoverUrl(val);
                                            if (val) {
                                                setCoverFile(null);
                                                setPreviewUrl(val);
                                            } else if (!coverFile) {
                                                // If link is cleared and no file, show placeholder preview
                                                setPreviewUrl(`https://placehold.co/150x200/374151/ffffff?text=${encodeURIComponent(title.charAt(0).toUpperCase() || 'B')}`);
                                            }
                                        }}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
                                        placeholder="https://example.com/cover.jpg"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('statusLabel')}
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as BookStatus)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
                                >
                                    <option value="unread">{t('unread')}</option>
                                    <option value="reading">{t('reading')}</option>
                                    <option value="completed">{t('completed')}</option>
                                </select>
                            </div>

                            {/* Note */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('noteLabel')}
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full h-28 px-4 py-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    placeholder={t('notePlaceholder')}
                                />
                            </div>

                            {/* Source */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('sourceLabel')}
                                </label>
                                <select
                                    value={source}
                                    onChange={(e) => setSource(e.target.value as BookSource | '')}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
                                >
                                    <option value="">{t('sourcePlaceholder')}</option>
                                    <option value="physical">{t('sourcePhysical')}</option>
                                    <option value="online">{t('sourceOnline')}</option>
                                    <option value="pdf">{t('sourcePDF')}</option>
                                    <option value="library">{t('sourceLibrary')}</option>
                                    <option value="other">{t('sourceOther')}</option>
                                </select>
                                {/* Source URL / Reference */}
                                {source && (
                                    <div className="mt-2">
                                        <label className="block text-xs text-gray-500 mb-1">
                                            {t('sourceUrlLabel')}
                                        </label>
                                        <input
                                            type="text"
                                            value={sourceUrl}
                                            onChange={(e) => setSourceUrl(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
                                            placeholder={t('sourceUrlPlaceholder')}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Reading Goal & Progress */}
                            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    🎯 {t('progressLabel')}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            {t('totalPagesLabel')}
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={totalPages}
                                            onChange={(e) => setTotalPages(e.target.value ? parseInt(e.target.value) : '')}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
                                            placeholder="300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            {t('pagesPerDayLabel')}
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={pagesPerDay}
                                            onChange={(e) => setPagesPerDay(e.target.value ? parseInt(e.target.value) : '')}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
                                            placeholder="20"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">
                                        {t('pagesReadLabel')}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max={totalPages ? Number(totalPages) : undefined}
                                        value={pagesRead}
                                        onChange={(e) => setPagesRead(e.target.value ? parseInt(e.target.value) : '')}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
                                        placeholder="0"
                                    />
                                </div>
                                {/* Progress Bar */}
                                {totalPages && Number(totalPages) > 0 && (
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>{pagesRead || 0} / {totalPages} {t('pages')}</span>
                                            <span>{progressPercent}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="h-2.5 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${progressPercent}%`,
                                                    background: progressPercent >= 100
                                                        ? 'linear-gradient(90deg, #10b981, #059669)'
                                                        : 'linear-gradient(90deg, #3b82f6, #6366f1)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {estimatedDays && (
                                    <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                                        <span>✨</span>
                                        <span>{t('estimatedDays')} <strong>{estimatedDays}</strong> {t('days')}</span>
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isUploading}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isUploading && (
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {isUploading ? t('saving') : t('saveChanges')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
