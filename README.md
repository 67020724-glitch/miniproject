# 📚 StoryNest+

> ระบบจัดการคลังหนังสือส่วนตัว (Personal Book Management System)

🔗 **Demo:** [https://storynest-livid.vercel.app](https://storynest-livid.vercel.app)

---

## 📖 เกี่ยวกับโปรเจค

**StoryNest+** คือเว็บแอปพลิเคชันสำหรับจัดการคลังหนังสือส่วนตัว ช่วยให้ผู้ใช้สามารถเพิ่ม แก้ไข ลบ และติดตามหนังสือที่อ่านได้อย่างง่ายดาย พร้อมระบบสถิติและสรุปพฤติกรรมการอ่าน ออกแบบด้วย UI ที่สวยงามและรองรับการใช้งานทั้งบนคอมพิวเตอร์และมือถือ

---

## ✨ ฟีเจอร์หลัก

### 📋 ระบบ CRUD
| ฟังก์ชัน | รายละเอียด |
|---------|-----------|
| **Create** | เพิ่มหนังสือใหม่ พร้อมอัปโหลดรูปปก, ระบุหมวดหมู่, ให้คะแนน |
| **Read** | ดูรายการหนังสือทั้งหมด, ค้นหา, กรองตามผู้เขียน/หมวดหมู่ |
| **Update** | แก้ไขข้อมูลหนังสือ (ชื่อ, ผู้เขียน, ปก, สถานะ, คะแนน, โน้ต) |
| **Delete** | ลบหนังสือลงถังขยะ, กู้คืน, หรือลบถาวร |

### 🔐 ระบบสมาชิกและการยืนยันตัวตน
- 📧 **อีเมล/รหัสผ่าน** — ลงทะเบียนและเข้าสู่ระบบด้วยอีเมล
- 🔑 **OAuth** — เข้าสู่ระบบผ่าน Google หรือ GitHub
- 🔄 **ลืมรหัสผ่าน** — รีเซ็ตรหัสผ่านผ่านลิงก์ที่ส่งไปทางอีเมล
- 🔒 **จดจำการเข้าสู่ระบบ** — Session ถูกจัดการผ่าน Supabase Auth
- 👤 **โปรไฟล์ผู้ใช้** — จัดการข้อมูลส่วนตัว (ชื่อ, รูปโปรไฟล์)

### 🎯 ฟีเจอร์เพิ่มเติม
- 📊 **สถานะการอ่าน** — ยังไม่ได้อ่าน / กำลังอ่าน / อ่านจบแล้ว
- ❤️ **หนังสือที่ถูกใจ** — กดถูกใจและดูรายการรวม
- 📝 **บันทึกโน้ต** — จดบันทึกสิ่งที่ได้เรียนรู้จากหนังสือ
- ⭐ **ให้คะแนน** — ให้คะแนนหนังสือ 1-5 ดาว
- 🔍 **ค้นหาและกรอง** — ค้นหาตามชื่อ กรองตามผู้เขียนหรือหมวดหมู่
- 📈 **สรุปพฤติกรรม** — แดชบอร์ดสถิติ กราฟวงกลม คะแนนความก้าวหน้า
- 🗑️ **ถังขยะ** — ระบบ Soft Delete พร้อมกู้คืน
- 🌙 **Dark Mode** — สลับธีมสว่าง/มืด
- 🌐 **2 ภาษา** — รองรับภาษาไทยและภาษาอังกฤษ
- 📱 **Responsive** — ใช้งานได้ทั้งบน Desktop และ Mobile
- ⚡ **Realtime** — อัปเดตข้อมูลแบบ Realtime ผ่าน Supabase

---

## 🛠️ เทคโนโลยีที่ใช้

| เทคโนโลยี | เวอร์ชัน | การใช้งาน |
|-----------|---------|----------|
| **Next.js** | 16.1.6 | React Framework (App Router) |
| **React** | 19.2.3 | UI Library |
| **TypeScript** | ^5 | Type-safe JavaScript |
| **Tailwind CSS** | ^4 | Utility-first CSS Framework |
| **Supabase** | ^2.95.3 | Backend-as-a-Service (Auth, Database, Storage, Realtime) |
| **Vercel** | — | Hosting & Deployment |

---

## 📂 โครงสร้างโปรเจค

```
storynest/
├── app/                        # Pages (App Router)
│   ├── page.tsx                # หน้าหลัก (Landing Page)
│   ├── layout.tsx              # Root Layout
│   ├── globals.css             # Global Styles
│   ├── icon.svg                # Favicon
│   ├── auth/                   # ระบบยืนยันตัวตน
│   │   ├── callback/
│   │   │   └── route.ts        # OAuth Callback Handler
│   │   └── reset-password/
│   │       └── page.tsx        # หน้ารีเซ็ตรหัสผ่าน
│   ├── library/                # หน้าคลังหนังสือ + สถิติ
│   ├── favorites/              # หน้าหนังสือที่ถูกใจ
│   ├── status/                 # หน้าสถานะการอ่าน
│   ├── summary/                # หน้าสรุปพฤติกรรม
│   ├── settings/               # หน้าตั้งค่า
│   ├── profile/                # หน้าโปรไฟล์ผู้ใช้
│   └── about/                  # หน้าเกี่ยวกับ
├── components/                 # React Components
│   ├── AddBookModal.tsx        # Modal เพิ่มหนังสือ
│   ├── EditBookModal.tsx       # Modal แก้ไขหนังสือ
│   ├── BookCard.tsx            # Card แสดงหนังสือ
│   ├── NoteModal.tsx           # Modal บันทึกโน้ต
│   ├── TrashModal.tsx          # Modal ถังขยะ
│   ├── AuthModal.tsx           # Modal เข้าสู่ระบบ/ลงทะเบียน/ลืมรหัสผ่าน (รองรับ OAuth)
│   ├── Sidebar.tsx             # เมนูด้านซ้าย
│   ├── Topbar.tsx              # แถบด้านบน
│   ├── ProfileMenu.tsx         # เมนูโปรไฟล์
│   ├── AppLayout.tsx           # Layout หลัก
│   ├── StatCard.tsx            # Card สถิติ
│   ├── CircleChart.tsx         # กราฟวงกลม
│   └── WelcomePage.tsx         # หน้าต้อนรับ
├── context/                    # React Context
│   ├── AuthContext.tsx         # จัดการ Authentication
│   ├── BookContext.tsx         # จัดการข้อมูลหนังสือ (CRUD)
│   ├── LanguageContext.tsx     # จัดการภาษา (TH/EN)
│   └── ThemeContext.tsx        # จัดการธีม (Light/Dark)
├── lib/
│   └── supabaseClient.ts      # Supabase Client Configuration
├── types/
│   └── book.ts                # TypeScript Interfaces (Book, BookStatus)
└── public/                    # Static Assets
```

---

## 🚀 วิธีติดตั้งและรันโปรเจค

### ข้อกำหนดเบื้องต้น
- Node.js 18+
- npm หรือ yarn
- Supabase Account

### ขั้นตอน

1. **Clone โปรเจค**
   ```bash
   git clone https://github.com/your-repo/storynest.git
   cd storynest
   ```

2. **ติดตั้ง Dependencies**
   ```bash
   npm install
   ```

3. **ตั้งค่า Environment Variables**

   สร้างไฟล์ `.env.local` ที่ root ของโปรเจค:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **ตั้งค่า Supabase**
   - สร้างตาราง `books` ใน Supabase Database
   - สร้าง Storage Bucket ชื่อ `book-covers` (ตั้งเป็น Public)
   - สร้าง Storage Bucket ชื่อ `avatars` (ตั้งเป็น Public)
   - เปิดใช้งาน Authentication:
     - **Email/Password** — เปิดใช้งาน Email Provider
     - **Google OAuth** — ตั้งค่า Google OAuth Client ID/Secret
     - **GitHub OAuth** — ตั้งค่า GitHub OAuth App
   - ตั้งค่า **Redirect URL** ให้ชี้ไปที่ `{YOUR_DOMAIN}/auth/callback`
   - เปิดใช้งาน Realtime สำหรับตาราง `books`

5. **รันโปรเจค**
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

---

## 👥 ผู้จัดทำ

| รหัสนักศึกษา | ชื่อ-นามสกุล |
|:---:|:---|
| 67020724 | กมลชนก คำนาค |
| 67020959 | ติณณภพ คำหลวง |
| 67024829 | พณิชพล สุวรรณหล้า |

---

<p align="center">
  <i>StoryNest+ — จัดการคลังหนังสือของคุณอย่างง่ายดาย 📚✨</i>
</p>
