// اعلام می‌کنیم که این فایل حتماً در سمت کلاینت (مرورگر) اجرا شود.
"use client";

// وارد کردن کامپوننت Link از Next.js برای ایجاد لینک داخلی بدون بارگذاری مجدد صفحه.
import Link from "next/link";

// وارد کردن کامپوننت تغییر تم (روشن/تاریک)
import ThemeToggle from "@/components/theme/ThemeToggle";

// گرفتن اطلاعات نشست (session) و تابع خروج از سیستم (signOut) از next-auth
import { useSession, signOut } from "next-auth/react";

// تعریف کامپوننت ناوبری بالا
export default function TopNav() {
  // گرفتن اطلاعات نشست کاربر (data: اطلاعات کاربر، status: وضعیت ورود)
  const { data, status } = useSession();



  return (
    // نوار ناوبری اصلی با کلاس‌های بوت‌استرپ برای استایل‌دهی
    <nav className="nav shadow justify-content-between mb-5">
      
      {/* بخش سمت چپ: لوگو و لینک ثابت نوشتن بلاگ */}
      <div className="d-flex align-items-center">
        <Link className="nav-link mt-2" href="/">
          🌀
        </Link>
        <Link className="nav-link" href="/blog/create">
          یک بلاگ بنویس
        </Link>
      </div>

      {/* بخش سمت راست: بر اساس وضعیت ورود کاربر */}
      <div className="d-flex align-items-center">
        {status === "authenticated" ? ( // اگر وضعیت کاربر "authenticated" (یعنی وارد شده) باشد، این بخش اجرا می‌شود.
  <>
    {/* 👤 نمایش اسم کاربر که لینک شود به صفحه داشبورد "author" */}
    {/* یعنی همیشه بدون توجه به نقش واقعی، روی اسمش کلیک کنیم می‌ره به /dashboard/author */}
    <Link className="nav-link" href={`/dashboard/user`}>
      {data.user.name}  {/* نمایش نام کاربر مثلاً "علی" */}
    </Link>

{/* بررسی می‌کنیم آیا کاربر نقش دارد و روی نقش‌ها map می‌زنیم */}
{data?.user?.role?.map((r) => {
  // تعریف معادل فارسی برای هر نقش کاربر
  const roleLabels = {
    admin: "مدیر",             // نقش admin به "مدیر" ترجمه می‌شود
    editor: "ویرایشگر",  
    author: "نویسنده",
         // نقش editor به "ویرایشگر"
  };
  // اگر نقش subscriber بود، هیچ‌چیز نمایش نده (یعنی از return خارج شو)
  if (r === "subscriber") return null;
  // نمایش یک لینک برای هر نقش با مسیر مناسب
  return (
    <Link
      key={r} // استفاده از نام نقش به عنوان کلید یکتا برای React
      className="nav-link" // کلاس استایل‌دهی برای لینک
      href={`/dashboard/${r === "subscriber" ? "user" : r}`} // اگر نقش subscriber باشد مسیر شود /dashboard/user، در غیر این صورت مسیر نقش (مثلاً /dashboard/admin)
    >
      {roleLabels[r] || r} {/* اگر معادل فارسی تعریف شده بود، نمایش بده؛ اگر نه خود متن نقش را نمایش بده */}
    </Link>
  );
})}


    {/* 🔚 دکمه خروج از حساب */}
    <a
      className="nav-link pointer"
      onClick={() => signOut({ callbackUrl: "/login" })} // با کلیک، کاربر خارج می‌شود و به صفحه login برمی‌گردد
    >
      خروج
    </a>
  </>
        ) : (
          <>
            {/* اگر کاربر وارد نشده باشد: نمایش لینک‌های ورود و ثبت‌نام */}
            <Link className="nav-link" href="/login">
              ورود
            </Link>
            <Link className="nav-link" href="/register">
              ثبت‌نام
            </Link>
          </>
        )}

        {/* دکمه تغییر تم (همیشه نمایش داده می‌شود) */}
        <div className="ms-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
