'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'th' | 'en';

// Translation keys
export const translations = {
    th: {
        // Navigation
        home: 'หน้าหลัก',
        library: 'คลัง',
        bookStatus: 'สถิติและเป้าหมาย',
        summary: 'สรุปพฤติกรรม',
        settings: 'ตั้งค่า',
        about: 'เกี่ยวกับ',
        favorites: 'หนังสือที่ถูกใจ',
        noFavorites: 'ยังไม่มีหนังสือที่ถูกใจ',
        dashboard: 'แดชบอร์ด',
        librarySubtitle: 'จัดการและจัดระเบียบชั้นหนังสือส่วนตัวของคุณ',
        noBookmarksTitle: 'ยังไม่มีบุ๊กมาร์ก',
        dashboardDesc: 'ภาพรวมการเดินทางแห่งการอ่านของคุณ',

        // Common
        search: 'ค้นหา',
        searchBooks: 'ค้นหาหนังสือ...',
        welcome: 'ยินดีต้อนรับสู่ StoryNest',
        back: 'ย้อนกลับ',
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
        aboutDescription: 'StoryNest คือระบบจัดการคลังหนังสือส่วนตัวที่ถูกพัฒนาขึ้นเพื่อเป็นเพื่อนคู่ใจของนักอ่านทุกคน ช่วยให้คุณบันทึก ติดตาม และวิเคราะห์พฤติกรรมการอ่านได้อย่างมีประสิทธิภาพในที่เดียว',
        mainFeatures: 'คุณสมบัติหลัก',
        featureTitle1: 'จัดการคลังส่วนตัว',
        featureDesc1: 'เพิ่ม แก้ไข และจัดระเบียบหนังสือในคลังได้ไม่จำกัด พร้อมรองรับรูปปกหนังสือที่สวยงาม',
        featureTitle2: 'ติดตามความก้าวหน้า',
        featureDesc2: 'อัปเดตหน้าหนังสือที่อ่านในแต่ละวัน พร้อมระบบคำนวณวันที่จะอ่านจบโดยประมาณ',
        featureTitle3: 'แดชบอร์ดอัจฉริยะ',
        featureDesc3: 'ดูสถิติพฤติกรรมการอ่าน สรุปรายปี และความสำเร็จที่คุณพิชิตได้จากการอ่าน',
        featureTitle4: 'ค้นหาและกรองข้อมูล',
        featureDesc4: 'ค้นหาหนังสือเล่มโปรดได้อย่างรวดเร็วด้วยระบบค้นหา กรองตามผู้เขียน หรือหมวดหมู่',
        ourMission: 'ภารกิจของเรา',
        missionDesc: 'เราเชื่อว่าความรู้และการเติบโตเกิดจากการอ่านที่มีวินัย StoryNest จึงถูกสร้างมาเพื่อช่วยให้นักอ่านทุกคนสามารถจัดการการเดินทางแห่งความรู้ได้อย่างมีแรงบันดาลใจและเป็นระเบียบที่สุด',
        privacyPolicy: 'ความโปร่งใสและข้อมูล',
        privacyDesc: 'ข้อมูลหนังสือและสถิติทั้งหมดของคุณจะถูกเก็บรักษาไว้ในระบบคลาวด์ที่ปลอดภัยและเข้าถึงได้เฉพาะคุณเท่านั้น เราให้ความสำคัญกับความเป็นส่วนตัวของคุณเป็นอันดับหนึ่ง',
        techStack: 'เทคโนโลยีเบื้องหลัง',
        version: 'เวอร์ชัน',

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

        // Forgot Password
        forgotPassword: 'ลืมรหัสผ่าน?',
        forgotPasswordTitle: 'ลืมรหัสผ่าน',
        forgotPasswordSubtitle: 'กรอกอีเมลของคุณ เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปให้',
        forgotPasswordError: 'ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้',
        sendResetLink: 'ส่งลิงก์รีเซ็ตรหัสผ่าน',
        resetEmailSent: 'ส่งอีเมลเรียบร้อยแล้ว!',
        resetEmailSentMessage: 'กรุณาตรวจสอบอีเมลของคุณเพื่อดำเนินการรีเซ็ตรหัสผ่าน',
        checkSpamFolder: 'หากไม่พบอีเมล กรุณาตรวจสอบโฟลเดอร์ Spam/Junk',
        backToLogin: 'กลับไปหน้าเข้าสู่ระบบ',
        rateLimitError: 'กรุณารอสักครู่แล้วลองใหม่อีกครั้ง',

        // Reset Password Page
        setNewPassword: 'ตั้งรหัสผ่านใหม่',
        setNewPasswordSubtitle: 'กรอกรหัสผ่านใหม่ของคุณด้านล่าง',
        newPasswordLabel: 'รหัสผ่านใหม่',
        confirmNewPasswordLabel: 'ยืนยันรหัสผ่านใหม่',
        resetPasswordButton: 'รีเซ็ตรหัสผ่าน',
        resetPasswordError: 'ไม่สามารถรีเซ็ตรหัสผ่านได้',
        passwordResetSuccess: 'รีเซ็ตรหัสผ่านสำเร็จ!',
        redirectingHome: 'กำลังนำคุณกลับไปหน้าหลัก...',
        verifyingLink: 'กำลังตรวจสอบลิงก์...',
        passwordMinLength: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
        passwordMismatch: 'รหัสผ่านไม่ตรงกัน',
        backToHome: 'กลับหน้าหลัก',

        // Social Login
        continueWithGoogle: 'เข้าสู่ระบบด้วย Google',
        continueWithApple: 'เข้าสู่ระบบด้วย Apple',
        continueWithGithub: 'เข้าสู่ระบบด้วย GitHub',
        orContinueWith: 'หรือเข้าสู่ระบบด้วยอีเมล',
        oauthError: 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่',

        // Profile
        profile: 'โปรไฟล์',
        guest: 'ผู้เยี่ยมชม',
        loginToManageLibrary: 'เข้าสู่ระบบเพื่อจัดการคลังหนังสือ',
        updateProfile: 'บันทึกข้อมูลส่วนตัว',
        profileUpdated: 'อัปเดตโปรไฟล์เรียบร้อยแล้ว',
        profileUpdateError: 'ไม่สามารถอัปเดตโปรไฟล์ได้',
        editProfile: 'แก้ไขโปรไฟล์',
        changeAvatar: 'เปลี่ยนรูปโปรไฟล์',

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
        saveFailed: 'บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',

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

        // Edit Book Modal
        editBookTitle: 'แก้ไขหนังสือ',
        editBook: 'แก้ไข',
        editDetails: 'รายละเอียด',
        editCover: 'ปกหนังสือ',
        editNotes: 'บันทึก',
        noteLabel: 'บันทึกของคุณ',
        notePlaceholder: 'เขียนความรู้สึก หรือสิ่งที่ได้เรียนรู้จากหนังสือเล่มนี้...',
        characters: 'ตัวอักษร',
        saveChanges: 'บันทึกการเปลี่ยนแปลง',
        fileSizeLimit: 'ขนาดไฟล์ต้องไม่เกิน 5MB',
        uploadFailed: 'การอัปโหลดรูปภาพล้มเหลว กรุณาลองใหม่อีกครั้ง',

        // Book Source
        sourceLabel: 'แหล่งที่มาของหนังสือ',
        sourcePhysical: 'หนังสือเล่มจริง (Physical Book)',
        sourceOnline: 'อ่านออนไลน์ (Online / E-book)',
        sourcePDF: 'PDF',
        sourceLibrary: 'ห้องสมุด (Library)',
        sourceOther: 'อื่นๆ (Other)',
        sourcePlaceholder: 'เลือกแหล่งที่มา',
        sourceUrlLabel: 'หลักฐาน / แหล่งอ้างอิง',
        sourceUrlPlaceholder: 'ใส่ลิงก์ URL หรือรายละเอียดแหล่งที่มา',

        // Reading Goal & Progress
        totalPagesLabel: 'จำนวนหน้าทั้งหมด',
        pagesPerDayLabel: 'เป้าหมายการอ่านต่อวัน (หน้า)',
        estimatedDays: 'คาดว่าจะอ่านจบใน',
        days: 'วัน',
        pages: 'หน้า',
        progressLabel: 'ความคืบหน้า',
        pagesReadLabel: 'จำนวนหน้าที่อ่านแล้ว',

        // Daily Goal
        todaysGoal: 'เป้าหมายวันนี้',
        readPages: 'อ่าน {count} หน้า',
        goalCompleted: '🎉 พิชิตเป้าหมายแล้ว!',
        dailyGoalTitle: 'เป้าหมายการอ่านประจำวัน',
        noGoalSet: 'ยังไม่ได้ตั้งเป้าหมาย',

        // Update Progress
        updateProgress: 'อัพเดตความคืบหน้า',
        pagesReadToday: 'จำนวนหน้าที่อ่านวันนี้',
        updateSuccess: 'อัพเดตสำเร็จ!',
        bookCompleted: 'อ่านจบเล่มนี้แล้ว! 🎉',

        // Home Page Sections
        recentlyAdded: '🕒 เพิ่มล่าสุด',
        currentlyReading: '📚 กำลังอ่าน',
        completedBooks: '✅ อ่านจบแล้ว',
        toReadBooks: '⏳ ยังไม่ได้อ่าน',
        booksCount: '{count} เล่ม',
        noBooksInSection: 'ไม่มีหนังสือในหมวดนี้',

        // Reading Goal & Analysis
        readingGoalTitle: 'เป้าหมายการอ่านประจำปี',
        yearGoalLabel: 'ฉายา/เป้าหมายหลัก',
        setReadingGoal: 'ตั้งเป้าหมายปีนี้',
        booksReadYear: 'อ่านจบแล้วปีนี้',
        remainingBooks: 'อีก {count} เล่มถึงเป้าหมาย',
        goalCompletedYear: '🎉 ยินดีด้วย ยอดเยี่ยมมาก!',
        readingProgressYear: 'สถิติการอ่านปี {year}',
        enterGoal: 'ตั้งเป้าหมาย (เล่ม)',
        saveGoal: 'บันทึกเป้าหมาย',
        annualStats: 'สถิติรายปี',
        currentGoal: 'เป้าหมายปัจจุบัน',
        achievements: 'ความสำเร็จ',
        achievement1: 'First Reader (เริ่มเล่มแรก)',
        achievement5: 'Book Explorer (นักสำรวจ)',
        achievement10: 'Knowledge Seeker (ผู้แสวงหาความรู้)',
        achievement20: 'Book Master (เจ้าแห่งคลังหนังสือ)',
        achievementGettingStarted: 'Getting Started (เริ่มก้าวแรก)',
        achievementLibraryBuilder: 'Library Builder (นักสร้างคลัง)',
        achievementGoal: 'Goal Achiever (ผู้พิชิตเป้าหมาย)',
        achievementStreak: 'Reading Streak (อ่านต่อเนื่อง)',
        readMore: 'อ่านต่อ',
        averagePerMonth: 'เฉลี่ยต่อเดือน',
        suggestions: 'คำแนะนำส่วนตัว',
        readSomethingNew: 'ลองเริ่มอ่านหนังสือเล่มใหม่วันนี้',
        dailyStats: 'สถิติรายวัน',
        monthlyStats: 'สถิติรายเดือน',
        viewOtherDays: 'ดูย้อนหลัง',
        yesterday: 'เมื่อวาน',
        selectDate: 'เลือกวันที่',
        pagesReadOn: 'หน้าที่อ่านในวันที่ {date}',
        noDataForDate: 'ไม่มีข้อมูลการอ่านในวันนี้',
        readingProgress: 'ความคืบหน้าการอ่าน',
        readToday: 'อ่านวันนี้',
        readThisMonth: 'อ่านเดือนนี้',
        readingStats: 'สถิติการอ่าน',
        thisMonth: 'เดือนนี้',
        today: 'วันนี้',
        dailyGoal: 'เป้าหมายรายวัน',
        accumulatedEffort: 'ความพยายามสะสม',
        achievementPageSeeker: 'นักอ่านหมื่นลี้',
        achievementGoalDesc: 'ผู้พิชิตเป้าหมายปี {year}',
        toNextGoal: 'จะถึงเป้าหมายถัดไป',
        bookmarks: 'ที่คั่นหนังสือ',
        noBookmarks: 'ยังไม่มีที่คั่นหนังสือ (เริ่มอ่านสักเล่มสิ!)',
        onPage: 'อ่านถึงหน้า',
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
        saveFailed: 'Failed to save changes. Please try again.',

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

        // Edit Book Modal
        editBookTitle: 'Edit Book',
        editBook: 'Edit',
        editDetails: 'Details',
        editCover: 'Cover',
        editNotes: 'Notes',
        noteLabel: 'Your Notes',
        notePlaceholder: 'Write your thoughts or what you learned from this book...',
        characters: 'characters',
        saveChanges: 'Save Changes',
        fileSizeLimit: 'File size must not exceed 5MB',
        uploadFailed: 'Image upload failed. Please try again.',

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
        bookStatus: 'Stats & Goals',
        summary: 'Summary',
        settings: 'Settings',
        about: 'About',
        favorites: 'Favorites',
        noFavorites: 'No favorite books yet',
        dashboard: 'Dashboard',
        librarySubtitle: 'Manage and organize your personal bookshelf',
        noBookmarksTitle: 'No bookmarks yet',
        dashboardDesc: 'Overview of your reading journey and statistics',

        // Common
        search: 'Search',
        searchBooks: 'Search books...',
        welcome: 'Welcome to StoryNest',
        back: 'Back',
        books: 'books',
        all: 'All',
        ofTotal: 'of total',

        // Book Status
        reading: 'Reading',
        completed: 'Finished',
        unread: 'To Read',
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
        aboutDescription: 'StoryNest is a personal book management system designed to be every reader\'s best companion. It helps you record, track, and analyze your reading habits efficiently in one place.',
        mainFeatures: 'Main Features',
        featureTitle1: 'Personal Library Management',
        featureDesc1: 'Add, edit, and organize unlimited books in your library with beautiful covers.',
        featureTitle2: 'Track Progress',
        featureDesc2: 'Update your daily reading progress with estimated finish dates calculation.',
        featureTitle3: 'Smart Dashboard',
        featureDesc3: 'View reading behavior statistics, annual summaries, and achievements you\'ve conquered.',
        featureTitle4: 'Search & Filter',
        featureDesc4: 'Quickly find your favorite books with search, author, or category filters.',
        ourMission: 'Our Mission',
        missionDesc: 'We believe knowledge and growth come from disciplined reading. StoryNest was created to help every reader manage their journey of knowledge as inspirationally and organized as possible.',
        privacyPolicy: 'Transparency & Data',
        privacyDesc: 'All your book data and statistics are kept in a secure cloud accessible only to you. We prioritize your privacy above all else.',
        techStack: 'Tech Stack',
        version: 'Version',

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

        // Forgot Password
        forgotPassword: 'Forgot password?',
        forgotPasswordTitle: 'Forgot Password',
        forgotPasswordSubtitle: 'Enter your email and we\'ll send you a reset link',
        forgotPasswordError: 'Could not send password reset email',
        sendResetLink: 'Send Reset Link',
        resetEmailSent: 'Email Sent!',
        resetEmailSentMessage: 'Please check your email to continue with the password reset',
        checkSpamFolder: 'If you don\'t see the email, check your Spam/Junk folder',
        backToLogin: 'Back to Login',
        rateLimitError: 'Please wait a moment and try again',

        // Reset Password Page
        setNewPassword: 'Set New Password',
        setNewPasswordSubtitle: 'Enter your new password below',
        newPasswordLabel: 'New Password',
        confirmNewPasswordLabel: 'Confirm New Password',
        resetPasswordButton: 'Reset Password',
        resetPasswordError: 'Could not reset password',
        passwordResetSuccess: 'Password Reset Successful!',
        redirectingHome: 'Redirecting you to the home page...',
        verifyingLink: 'Verifying link...',
        passwordMinLength: 'Password must be at least 6 characters',
        passwordMismatch: 'Passwords do not match',
        backToHome: 'Back to Home',

        // Social Login
        continueWithGoogle: 'Continue with Google',
        continueWithApple: 'Continue with Apple',
        continueWithGithub: 'Continue with GitHub',
        orContinueWith: 'or continue with email',
        oauthError: 'Could not sign in. Please try again.',

        // Profile
        profile: 'Profile',
        guest: 'Guest',
        loginToManageLibrary: 'Login to manage your library',
        updateProfile: 'Update Profile',
        profileUpdated: 'Profile updated successfully',
        profileUpdateError: 'Could not update profile',
        editProfile: 'Edit Profile',
        changeAvatar: 'Change Avatar',

        // Book Source
        sourceLabel: 'Book Source',
        sourcePhysical: 'Physical Book',
        sourceOnline: 'Online / E-book',
        sourcePDF: 'PDF',
        sourceLibrary: 'Library',
        sourceOther: 'Other',
        sourcePlaceholder: 'Select source',
        sourceUrlLabel: 'Reference / Evidence',
        sourceUrlPlaceholder: 'Enter URL or describe the source',

        // Reading Goal & Progress
        totalPagesLabel: 'Total Pages',
        pagesPerDayLabel: 'Reading Goal per Day (pages)',
        estimatedDays: 'Estimated to finish in',
        days: 'days',
        pages: 'pages',
        progressLabel: 'Progress',
        pagesReadLabel: 'Pages Read',

        // Daily Goal
        todaysGoal: "Today's Goal",
        readPages: 'Read {count} pages',
        goalCompleted: '🎉 Goal completed!',
        dailyGoalTitle: 'Daily Reading Goal',
        noGoalSet: 'No goal set',

        // Update Progress
        updateProgress: 'Update Progress',
        pagesReadToday: 'Pages read today',
        updateSuccess: 'Updated successfully!',
        bookCompleted: 'Book completed! 🎉',

        // Home Page Sections
        recentlyAdded: '🕒 Recently Added',
        currentlyReading: '📚 Currently Reading',
        completedBooks: '✅ Completed',
        toReadBooks: '⏳ To Read',
        booksCount: '{count} books',
        noBooksInSection: 'No books in this section',

        // Reading Goal & Analysis
        readingGoalTitle: 'Annual Reading Goal',
        yearGoalLabel: 'Primary Goal/Title',
        setReadingGoal: 'Set Annual Goal',
        booksReadYear: 'Read this year',
        remainingBooks: '{count} books left to goal',
        goalCompletedYear: '🎉 Congrats, you did it!',
        readingProgressYear: 'Reading Stats for {year}',
        enterGoal: 'Enter Goal (books)',
        saveGoal: 'Save Goal',
        annualStats: 'Annual Stats',
        currentGoal: 'Current Goal',
        achievements: 'Achievements',
        achievement1: 'First Reader',
        achievement5: 'Book Explorer',
        achievement10: 'Knowledge Seeker',
        achievement20: 'Book Master',
        achievementGettingStarted: 'Getting Started',
        achievementLibraryBuilder: 'Library Builder',
        achievementGoal: 'Goal Achiever',
        achievementStreak: 'Reading Streak',
        readMore: 'Read More',
        averagePerMonth: 'Avg per Month',
        suggestions: 'Personal Suggestions',
        readSomethingNew: 'Try starting a new book today',
        dailyStats: 'Daily Stats',
        monthlyStats: 'Monthly Stats',
        viewOtherDays: 'History',
        yesterday: 'Yesterday',
        selectDate: 'Select Date',
        pagesReadOn: 'Pages read on {date}',
        noDataForDate: 'No reading data for this date',
        readingProgress: 'Reading Progress',
        readToday: 'Read Today',
        readThisMonth: 'Read this Month',
        readingStats: 'Reading Statistics',
        thisMonth: 'This Month',
        today: 'Today',
        dailyGoal: 'Daily Goal',
        accumulatedEffort: 'Accumulated Effort',
        achievementPageSeeker: 'Page Seeker',
        achievementGoalDesc: '{year} Goal Achiever',
        toNextGoal: 'to next goal',
        bookmarks: 'Bookmarks',
        noBookmarks: 'No bookmarks yet (start reading!)',
        onPage: 'On page',
    }
}

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
