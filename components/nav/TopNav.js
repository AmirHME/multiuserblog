// اعلام می‌کنیم که این فایل باید حتماً در سمت کلاینت (مرورگر) اجرا شود.
"use client";

// وارد کردن کامپوننت Link از کتابخانه Next.js برای ایجاد لینک‌های داخلی بدون رفرش صفحه.
import Link from "next/link";

// وارد کردن کامپوننت ThemeToggle برای مدیریت تغییر تم (روشن/تاریک) پروژه.
import ThemeToggle from "@/components/theme/ThemeToggle";

// وارد کردن توابع useSession و signOut از کتابخانه next-auth برای دریافت وضعیت کاربر و امکان خروج از حساب.
import { useSession, signOut } from "next-auth/react";

// تعریف کامپوننت TopNav که منوی بالای سایت را می‌سازد.
export default function TopNav() {

  // گرفتن اطلاعات نشست کاربر شامل داده‌ها (data)، وضعیت نشست (status) و وضعیت بارگذاری (loading).
  const { data, status, loading } = useSession();

  // بازگشت (return) کد JSX برای نمایش ساختار ناوبری در صفحه.
  return (
    // تگ <nav> برای تعریف نوار ناوبری با استفاده از کلاس‌های Bootstrap برای استایل‌دهی.
    <nav className="nav shadow justify-content-between mb-5">

      {/* بخش سمت چپ نوار منو */}
      <div className="d-flex align-items-center">

        {/* لینک لوگوی سایت که کاربر را به صفحه اصلی می‌برد */}
        <Link className="nav-link mt-2" href="/">
          🌀
        </Link>

        {/* لینک ثابت برای نوشتن یک بلاگ جدید، که همیشه نمایش داده می‌شود */}
        <Link className="nav-link" href="/blog/create">
          یک بلاگ بنویس
        </Link>
      </div>

      {/* بخش سمت راست نوار منو */}
      <div className="d-flex align-items-center">

        {/* اگر کاربر وارد شده باشد (وضعیت نشست authenticated باشد) */}
        {status === "authenticated" ? (
          <>
            {/* نمایش نام کاربر به عنوان لینک به داشبورد کاربر */}
            <Link className="nav-link" href="/dashboard/user">
              {data?.user?.name}
            </Link>

            {/* دکمه خروج که با کلیک روی آن کاربر از حساب خود خارج می‌شود */}
            <a
              className="nav-link pointer"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              خروج
            </a>
          </>
        ) : (
          <>
            {/* اگر کاربر وارد نشده باشد، لینک‌های ورود و ثبت نام نمایش داده می‌شوند */}
            <Link className="nav-link" href="/login">
              ورود
            </Link>

            <Link className="nav-link" href="/register">
              ثبت نام
            </Link>
          </>
        )}

        {/* دکمه تغییر تم (روشن یا تاریک) که همیشه در کنار منوها نمایش داده می‌شود */}
        <div className="ms-2">
          <ThemeToggle />
        </div>

      </div>

    </nav>    
  );
}
