//فایل middleware.js در ریشه پروژه

// وارد کردن middleware آماده از next-auth
export { default } from "next-auth/middleware";

// تعریف مسیرهایی که باید محافظت شوند
export const config = {
  matcher: ["/dashboard/:path*"],
};
