/**
 * فایل route.js برای پیاده‌سازی API احراز هویت NextAuth
 * مسیر: app/api/auth/[...nextauth]/route.js
 *
 * این فایل API endpoints مورد نیاز برای NextAuth را ایجاد می‌کند
 * [...nextauth] به معنای catch-all route است که تمام مسیرهای زیر /api/auth/ را پوشش می‌دهد
 * مانند: /api/auth/signin, /api/auth/session, /api/auth/callback, و غیره
 */

import NextAuth from "next-auth";
// وارد کردن NextAuth که کتابخانه اصلی احراز هویت است

import { authOptions } from "@/utils/authOptions";
// وارد کردن تنظیمات احراز هویت از فایل جداگانه برای مدیریت بهتر کد

const handler = NextAuth(authOptions);
// ایجاد handler با استفاده از تنظیمات authOptions

export { handler as GET, handler as POST };
// صادر کردن handler برای درخواست‌های GET و POST
// NextAuth برای عملیات مختلف از هر دو متد استفاده می‌کند 
