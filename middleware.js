// // فایل middleware.js در ریشه پروژه

// // وارد کردن middleware آماده از next-auth
// export { default } from "next-auth/middleware";

// // تعریف مسیرهایی که باید محافظت شوند
// export const config = {
//   matcher: ["/dashboard/:path*"],
// };

// middleware.js

// 🔐 وارد کردن ابزار احراز هویت از next-auth
import { withAuth } from "next-auth/middleware";

// 📦 وارد کردن ابزار پاسخ‌دهی از next/server برای ریدایرکت
import { NextResponse } from "next/server";

// 🛡️ تعیین مسیرهایی که باید محافظت شوند
// مشخص کردن مسیرهایی که باید توسط middleware بررسی شوند
export const config = {
  matcher: [
    "/dashboard/:path*",   // همه صفحات داشبورد (admin، author و...)
    "/blog/create",        // صفحه ایجاد بلاگ
    "/api/user/:path*",    // APIهای کاربر عادی
    "/api/admin/:path*",   // APIهای ادمین
    "/api/author/:path*",  // APIهای نویسنده
    "/crud/:path",         // مسیرهای مربوط به عملیات CRUD
  ],
};


// ✅ تعریف middleware برای بررسی نقش کاربر
export default withAuth(

  async function middleware(req) {
    const url = req.nextUrl.pathname;

    // 🧠 چون role درون token.user ذخیره شده، باید از این مسیر بگیریمش
const role = req?.nextauth?.token?.role;

const isAdmin = Array.isArray(role)
  ? role.includes("admin")
  : role === "admin";


    // ❌ اگر وارد مسیر admin شد ولی نقش admin نداشت → ریدایرکت کن به صفحه اصلی
    if (url.includes("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // بررسی می‌کنیم که آیا نقش کاربر author هست یا نه

    const isAuthor = Array.isArray(role)
      // اگر نقش به صورت آرایه‌ای از چند نقش بود (مثلاً ["user", "author"])
      ? role.includes("author")
      // اگر نقش به صورت یک مقدار تکی بود (مثلاً "author")
      : role === "author";

    // ❌ اگر مسیر درخواستی شامل "/author" بود و نقش کاربر author نبود → ریدایرکت به صفحه اصلی
    if (url.includes("/author") && !isAuthor) {
      return NextResponse.redirect(new URL("/", req.url));
    }


    return NextResponse.next(); // ✅ در غیر این صورت ادامه بده
  },

  {
    callbacks: {
      authorized: ({ token }) => {
        // فقط اگر توکن وجود داشت اجازه بده
        return !!token;
      },
    },
  }
);
