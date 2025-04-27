// اعلام میکنیم که این فایل باید حتماً سمت کلاینت (مرورگر) اجرا شود
"use client";

// فایل اصلی استایل‌های پروژه (CSS عمومی) را وارد میکنیم
import "./globals.css";

// استایل‌های آماده‌ی Bootstrap را وارد میکنیم تا از کامپوننت‌های آماده و ریسپانسیو استفاده شود
import "bootstrap/dist/css/bootstrap.min.css";

// ThemeProvider برای مدیریت تم پروژه (مثل دارک مود و لایت مود) وارد میشود
import { ThemeProvider } from "@/context/theme";

// کامپوننت نوار بالایی سایت (Top Navigation) را وارد میکنیم
import TopNav from "@/components/nav/TopNav";

// Toaster برای نمایش اعلان‌های موقت (Toast Notification) در پروژه وارد میشود
import { Toaster } from "react-hot-toast";

// SessionProvider برای مدیریت نشست کاربران (Login/Logout/Session) از next-auth وارد میشود
import { SessionProvider } from "next-auth/react";

// تابع اصلی Layout پروژه که قالب کلی صفحات و ساختار ثابت را مشخص می‌کند
export default function RootLayout({ children }) {
  return (
    // تگ <html> برای مشخص کردن زبان و ساختار کلی سند HTML
    <html lang="en">

      {/* SessionProvider کل پروژه را در بر می‌گیرد تا وضعیت نشست کاربر در تمام بخش‌ها قابل دسترسی باشد */}
      <SessionProvider>

        {/* ThemeProvider پروژه را در بر می‌گیرد تا امکان تغییر تم (روشن/تاریک) فراهم شود */}
        <ThemeProvider>

          {/* تگ <body> برای نمایش محتوای اصلی صفحات */}
          <body suppressHydrationWarning={true}>
            
            {/* نوار بالایی سایت که در تمام صفحات ثابت نمایش داده می‌شود */}
            <TopNav />

            {/* Toaster برای نمایش اعلان‌های موقت در سراسر پروژه */}
            <Toaster />

            {/* children نشان‌دهنده محتوای اختصاصی هر صفحه است که درون قالب اصلی قرار می‌گیرد */}
            {children}

          </body>

        </ThemeProvider>

      </SessionProvider>

    </html>
  );
}
