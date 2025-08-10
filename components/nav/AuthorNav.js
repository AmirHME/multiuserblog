// وارد کردن کامپوننت Link از Next.js برای ایجاد لینک داخلی بدون بارگذاری مجدد کل صفحه
import Link from "next/link";

// تعریف یک کامپوننت به نام AuthorNav که منوی نویسنده را نمایش می‌دهد
export default function AuthorNav() {
  return (
    <>
      {/* نوار ناوبری با کلاس‌هایی از Bootstrap برای مرکزچینی آیتم‌ها */}
      <nav className="nav justify-content-center">
        
        {/* لینک به صفحه داشبورد نویسنده */}
        <Link className="nav-link" href="/dashboard/author">
          نویسنده
        </Link>

        {/* لینک به صفحه ساخت بلاگ جدید */}
        <a className="nav-link" href="/blog/create">
          یک بلاگ بنویس
        </a>

        {/* لینک به صفحه نمایش بلاگ های من */}
        <Link className="nav-link" href="/dashboard/author/blogs">
          بلاگ های من
        </Link>

        
      </nav>
    </>
  );
}
