// این کامپوننت نوار ناوبری ادمین را نمایش می‌دهد
// در فایل layout مربوط به بخش admin استفاده می‌شود

import Link from "next/link"; // وارد کردن لینک داخلی از کتابخانه Next.js

// تعریف کامپوننت AdminNav برای نمایش نوار منوی مدیریت
export default function AdminNav() {
  return (
    <>
      {/* منوی ناوبری با کلاس‌های بوت‌استرپ برای مرکزچین بودن و فاصله پایین */}
      <nav className="nav justify-content-center mb-3">
        {/* لینک به صفحه اصلی پنل ادمین */}
        <Link className="nav-link" href="/dashboard/admin">
          مدیریت
        </Link>

        {/* لینک به صفحه ایجاد محصول جدید */}
        <Link className="nav-link" href="/dashboard/admin/product/create">
          افزودن محصول
        </Link>
      </nav>
    </>
  );
}
