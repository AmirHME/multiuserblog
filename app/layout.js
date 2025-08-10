// این دستور نشان می‌دهد که این کامپوننت باید در سمت کلاینت (مرورگر) اجرا شود
// دلیل: استفاده از هوک‌های React و ویژگی‌های مختص مرورگر
"use client";

// وارد کردن فایل CSS عمومی پروژه که شامل استایل‌های پایه است
import "./globals.css";

// وارد کردن استایل‌های CSS کتابخانه Bootstrap برای استفاده از کامپوننت‌های آماده
import "bootstrap/dist/css/bootstrap.min.css";

// وارد کردن ThemeProvider از context مخصوص تم پروژه
// مسئولیت: مدیریت حالت تاریک/روشن در سراسر برنامه
import { ThemeProvider } from "@/context/theme";

// وارد کردن کامپوننت نوار بالایی سایت
import TopNav from "@/components/nav/TopNav";

// وارد کردن کامپوننت Toaster از کتابخانه react-hot-toast
// مسئولیت: نمایش اعلان‌های موقت (Toast) در برنامه
import { Toaster } from "react-hot-toast";

// وارد کردن SessionProvider از next-auth
// مسئولیت: مدیریت وضعیت احراز هویت کاربر در سراسر برنامه
import { SessionProvider } from "next-auth/react";

// وارد کردن BlogProvider از context مخصوص بلاگ
// مسئولیت: مدیریت وضعیت و داده‌های مربوط به بلاگ
import { BlogProvider } from "@/context/blog";

// کامپوننت اصلی Layout که ساختار پایه تمام صفحات را تعیین می‌کند
export default function RootLayout({ children }) {
  return (
    // تگ html اصلی با مشخصات:
    // - زبان: فارسی (fa)
    // - جهت نوشتار: راست به چپ (rtl)
    // - غیرفعال کردن هشدارهای hydration
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      {/* بدنه اصلی صفحه */}
      <body suppressHydrationWarning>
        {/* 
          SessionProvider:
          - کل برنامه را در بر می‌گیرد
          - وضعیت احراز هویت را در تمام کامپوننت‌ها قابل دسترس می‌کند
        */}
        <SessionProvider>
          {/* 
            ThemeProvider:
            - کل برنامه را در بر می‌گیرد
            - امکان تغییر تم (تاریک/روشن) را فراهم می‌کند
          */}
          <ThemeProvider>
            {/* 
              BlogProvider:
              - کل برنامه را در بر می‌گیرد
              - داده‌ها و وضعیت مربوط به بلاگ را مدیریت می‌کند
            */}
            <BlogProvider>
              {/* 
                کامپوننت TopNav:
                - نوار بالایی سایت
                - در تمام صفحات ثابت است
              */}
              <TopNav />

              {/* 
                کامپوننت Toaster:
                - نمایش اعلان‌های موقت در سراسر برنامه
                - موقعیت پیش‌فرض: بالای صفحه
              */}
              <Toaster />

              {/* 
                محتوای اصلی هر صفحه:
                - children شامل محتوای اختصاصی هر صفحه می‌شود
                - container: محدود کردن عرض محتوا و居中 کردن آن
                - py-4: padding عمودی به اندازه 4 واحد
              */}
              <main className="container py-4">
                {children}
              </main>
            </BlogProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}