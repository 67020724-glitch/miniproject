'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'th' | 'en';

// Translation keys
export const translations = {
    th: {
        // Navigation
        home: 'หน้าหลัก',
        library: 'คลัง',
        bookStatus: 'สถานะหนังสือ',
        summary: 'สรุปพฤติกรรม',
        settings: 'ตั้งค่า',
        about: 'เกี่ยวกับ',
        favorites: 'หนังสือที่ถูกใจ',
        noFavorites: 'ยังไม่มีหนังสือที่ถูกใจ',

        // Common
        search: 'ค้นหา',
        searchBooks: 'ค้นหาหนังสือ...',
        welcome: 'ยินดีต้อนรับสู่ StoryNest',
        books: 'เล่ม',
        all: 'ทั้งหมด',
        ofTotal: 'ของทั้งหมด',

        // Book Status
        reading: 'กำลังอ่าน',
        completed: 'อ่านจบแล้ว',
        unread: 'ยังไม่ได้อ่าน',
        notYetRead: 'ยังไม่ได้อ่าน',
        stillReading: 'อ่านยังไม่จบ',

        // Settings Page
        settingsTitle: 'ตั้งค่า',
        theme: 'ธีม',
        lightMode: 'โหมดสว่าง',
        darkMode: 'โหมดมืด',
        language: 'ภาษา',
        dataManagement: 'จัดการข้อมูล',
        exportData: 'นำออกข้อมูล (Export)',
        deleteAllData: 'ลบข้อมูลทั้งหมด',

        // Home Page
        recentBooks: 'รายการล่าสุด',
        allBooks: 'รายการหนังสือ',
        searchResults: 'ผลการค้นหา',
        showAll: 'ทั้งหมด',
        noBooksYet: 'ยังไม่มีหนังสือในคลัง',
        addFirstBook: 'เพิ่มหนังสือเล่มแรก',
        found: 'พบ',
        resultsFor: 'รายการ สำหรับ',
        noResults: 'ไม่พบหนังสือที่ตรงกับ',

        // Library Page
        totalBooks: 'จำนวนหนังสือทั้งหมด',

        // Status Page
        noBooksInCategory: 'ไม่มีหนังสือในหมวดหมู่นี้',

        // Summary Page
        readingProgressScore: 'คะแนนความก้าวหน้าการอ่าน',
        scoreCalculation: 'คำนวณจาก: อ่านจบ (100%) + กำลังอ่าน (50%)',
        librarySummary: 'สรุปคลังหนังสือ',
        tips: 'คำแนะนำ',
        tipUnread: 'คุณมีหนังสือรอคิว {count} เล่ม เริ่มอ่านสักเล่มดีไหม?',
        tipMultipleReading: 'คุณกำลังอ่านหลายเล่มพร้อมกัน ลองโฟกัสทีละเล่มดู',
        tipCompleted: 'ยอดเยี่ยม! คุณอ่านจบไปแล้ว {count} เล่ม 🎉',
        tipEmpty: 'เริ่มเพิ่มหนังสือเล่มแรกของคุณกันเถอะ!',
        waiting: 'รอคิว',

        // About Page
        aboutDescription: 'StoryNest คือระบบจัดการคลังหนังสือส่วนตัวที่ช่วยให้คุณติดตามหนังสือที่อ่าน จัดการสถานะการอ่าน และดูสถิติพฤติกรรมการอ่านของคุณได้อย่างง่ายดาย',
        mainFeatures: 'คุณสมบัติหลัก',
        feature1: 'เพิ่ม แก้ไข ลบหนังสือได้อย่างอิสระ',
        feature2: 'จัดการสถานะการอ่าน (ยังไม่ได้อ่าน / กำลังอ่าน / อ่านจบแล้ว)',
        feature3: 'ดูสถิติจำนวนหนังสือในคลัง',
        feature4: 'ค้นหาหนังสือได้ง่าย',
        techStack: 'เทคโนโลยีที่ใช้',

        // Library Chart
        totalSummary: 'ผลรวมทั้งหมด',
        proportion: '(จำนวนทั้งหมดเป็นสัดส่วน)',

        // Trash Modal
        trash: 'ถังขยะ',
        items: 'รายการ',
        trashEmpty: 'ถังขยะว่างเปล่า',
        deletedAt: 'ลบเมื่อ',
        restore: 'กู้คืน',
        moveToTrash: 'ย้ายลงถังขยะ',
        permanentDelete: 'ลบถาวร',
        clearTrash: 'ล้างถังขยะทั้งหมด',
        confirmDelete: 'ยืนยันการลบถาวร',
        confirmDeleteMessage: 'คุณต้องการลบ "{title}" อย่างถาวรหรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้',
        confirmClearTrash: 'ยืนยันการล้างถังขยะ',
        confirmClearTrashMessage: 'คุณต้องการลบหนังสือทั้งหมด {count} เล่มอย่างถาวรหรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้',
        cancel: 'ยกเลิก',

        // Auth
        login: 'เข้าสู่ระบบ',
        register: 'ลงทะเบียน',
        logout: 'ออกจากระบบ',
        loginTitle: 'เข้าสู่ระบบ',
        registerTitle: 'ลงทะเบียน',
        loginSubtitle: 'ยินดีต้อนรับกลับ! กรุณาเข้าสู่ระบบ',
        registerSubtitle: 'สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งาน',
        nameLabel: 'ชื่อ',
        namePlaceholder: 'ชื่อของคุณ',
        emailLabel: 'อีเมล',
        passwordLabel: 'รหัสผ่าน',
        confirmPasswordLabel: 'ยืนยันรหัสผ่าน',
        rememberMe: 'จดจำฉันไว้ในระบบ',
        processing: 'กำลังดำเนินการ...',
        noAccount: 'ยังไม่มีบัญชี?',
        hasAccount: 'มีบัญชีแล้ว?',
        switchToRegister: 'ลงทะเบียน',
        switchToLogin: 'เข้าสู่ระบบ',
        systemDescription: 'ระบบจัดการคลังหนังสือส่วนตัว',
        getStarted: 'ลงทะเบียนใช้งาน',
        loginButton: 'เข้าสู่ระบบ',

        // Profile
        profile: 'โปรไฟล์',
        guest: 'ผู้เยี่ยมชม',
        loginToManageLibrary: 'เข้าสู่ระบบเพื่อจัดการคลังหนังสือ',

        // Add Book Modal
        addBookTitle: 'เพิ่มหนังสือใหม่',
        titleLabel: 'ชื่อหนังสือ *',
        titlePlaceholder: 'กรอกชื่อหนังสือ',
        authorLabel: 'ผู้เขียน',
        authorPlaceholder: 'กรอกชื่อผู้เขียน',
        categoryLabel: 'หมวดหมู่',
        categoryPlaceholder: 'ระบุหมวดหมู่ เช่น: นิยาย, พัฒนาตนเอง',
        coverLabel: 'รูปปกหนังสือ',
        statusLabel: 'สถานะ',
        ratingLabel: 'ให้คะแนน',
        uploadImage: 'คลิกเพื่ออัปโหลดรูปภาพ',
        dragDrop: 'หรือลากไฟล์มาวาง (สูงสุด 5MB)',
        orUrl: 'หรือใช้ URL',
        changeImage: 'เปลี่ยนรูป',
        save: 'เพิ่มหนังสือ',
        saving: 'กำลังบันทึก...',

        // Categories
        catFiction: 'นิยาย (Fiction)',
        catSelfHelp: 'พัฒนาตนเอง (Self-Help)',
        catBusiness: 'ธุรกิจ (Business)',
        catTechnology: 'เทคโนโลยี (Technology)',
        catHistory: 'ประวัติศาสตร์ (History)',
        catFinance: 'การเงิน (Finance)',
        catPsychology: 'จิตวิทยา (Psychology)',
        // Filters
        filterByAuthor: 'ตามผู้เขียน',
        filterByCategory: 'ตามหมวดหมู่',
        allAuthors: 'ผู้เขียนทั้งหมด',
        allCategories: 'หมวดหมู่ทั้งหมด',

        // Library Notes
        readingNotes: 'บันทึกการอ่านของคุณ',
        noReadingNotes: 'ยังไม่มีบันทึกการอ่าน',
        addNote: 'บันทึกโน้ต',
        started: 'เริ่ม',
        finished: 'จบ',
    },
    en: {
        // Add Book Modal
        addBookTitle: 'Add New Book',
        titleLabel: 'Title *',
        titlePlaceholder: 'Enter book title',
        authorLabel: 'Author',
        authorPlaceholder: 'Enter author name',
        categoryLabel: 'Category',
        categoryPlaceholder: 'Enter category e.g. Fiction, Self-Help',
        coverLabel: 'Book Cover',
        statusLabel: 'Status',
        ratingLabel: 'Rating',
        uploadImage: 'Click to upload image',
        dragDrop: 'or drag and drop (max 5MB)',
        orUrl: 'or use URL',
        changeImage: 'Change Image',
        save: 'Add Book',
        saving: 'Saving...',

        // Filters
        filterByAuthor: 'By Author',
        filterByCategory: 'By Category',
        allAuthors: 'All Authors',
        allCategories: 'All Categories',

        // Library Notes
        readingNotes: 'Your Reading Notes',
        noReadingNotes: 'No reading notes yet',
        addNote: 'Edit Note',
        started: 'Started',
        finished: 'Finished',

        // Categories
        catFiction: 'Fiction',
        catSelfHelp: 'Self-Help',
        catBusiness: 'Business',
        catTechnology: 'Technology',
        catHistory: 'History',
        catFinance: 'Finance',
        catPsychology: 'Psychology',

        // Navigation
        home: 'Home',
        library: 'Library',
        bookStatus: 'Book Status',
        summary: 'Summary',
        settings: 'Settings',
        about: 'About',
        favorites: 'Favorites',
        noFavorites: 'No favorite books yet',

        // Common
        search: 'Search',
        searchBooks: 'Search books...',
        welcome: 'Welcome to StoryNest',
        books: 'books',
        all: 'All',
        ofTotal: 'of total',

        // Book Status
        reading: 'Reading',
        completed: 'Completed',
        unread: 'Unread',
        notYetRead: 'Not yet read',
        stillReading: 'Still reading',

        // Settings Page
        settingsTitle: 'Settings',
        theme: 'Theme',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
        language: 'Language',
        dataManagement: 'Data Management',
        exportData: 'Export Data',
        deleteAllData: 'Delete All Data',

        // Home Page
        recentBooks: 'Recent Books',
        allBooks: 'All Books',
        searchResults: 'Search Results',
        showAll: 'Show All',
        noBooksYet: 'No books yet',
        addFirstBook: 'Add your first book',
        found: 'Found',
        resultsFor: 'results for',
        noResults: 'No books matching',

        // Library Page
        totalBooks: 'Total Books',

        // Status Page
        noBooksInCategory: 'No books in this category',

        // Summary Page
        readingProgressScore: 'Reading Progress Score',
        scoreCalculation: 'Calculated from: Completed (100%) + Reading (50%)',
        librarySummary: 'Library Summary',
        tips: 'Tips',
        tipUnread: 'You have {count} books waiting. Start reading one?',
        tipMultipleReading: 'You are reading multiple books. Try focusing on one at a time.',
        tipCompleted: 'Excellent! You have finished {count} books 🎉',
        tipEmpty: 'Start adding your first book!',
        waiting: 'Waiting',

        // About Page
        aboutDescription: 'StoryNest is a personal book management system that helps you track your reading, manage reading status, and view your reading behavior statistics easily.',
        mainFeatures: 'Main Features',
        feature1: 'Add, edit, and delete books freely',
        feature2: 'Manage reading status (Unread / Reading / Completed)',
        feature3: 'View library statistics',
        feature4: 'Search books easily',
        techStack: 'Technology Stack',

        // Library Chart
        totalSummary: 'Total Summary',
        proportion: '(Total as proportion)',

        // Trash Modal
        trash: 'Trash',
        items: 'items',
        trashEmpty: 'Trash is empty',
        deletedAt: 'Deleted at',
        restore: 'Restore',
        moveToTrash: 'Move to Trash',
        permanentDelete: 'Delete permanently',
        clearTrash: 'Clear all trash',
        confirmDelete: 'Confirm permanent delete',
        confirmDeleteMessage: 'Do you want to permanently delete "{title}"? This action cannot be undone.',
        confirmClearTrash: 'Confirm clear trash',
        confirmClearTrashMessage: 'Do you want to permanently delete all {count} books? This action cannot be undone.',
        cancel: 'Cancel',

        // Auth
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        loginTitle: 'Login',
        registerTitle: 'Register',
        loginSubtitle: 'Welcome back! Please login.',
        registerSubtitle: 'Create a new account to get started.',
        nameLabel: 'Name',
        namePlaceholder: 'Your Name',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        confirmPasswordLabel: 'Confirm Password',
        rememberMe: 'Remember Me',
        processing: 'Processing...',
        noAccount: 'Don\'t have an account?',
        hasAccount: 'Already have an account?',
        switchToRegister: 'Register',
        switchToLogin: 'Login',
        systemDescription: 'Personal Book Management System',
        getStarted: 'Get Started',
        loginButton: 'Login',

        // Profile
        profile: 'Profile',
        guest: 'Guest',
        loginToManageLibrary: 'Login to manage your library',
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations.th) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('th');

    // Load language from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('storynest-language') as Language;
        if (savedLang) {
            setLanguageState(savedLang);
        }
    }, []);

    // Save language to localStorage
    useEffect(() => {
        localStorage.setItem('storynest-language', language);
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = (key: keyof typeof translations.th): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
