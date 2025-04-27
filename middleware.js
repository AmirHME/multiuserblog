// فایل middleware.js در ریشه پروژه

// وارد کردن middleware آماده از next-auth
export { default } from "next-auth/middleware";
export const config = { matcher: ["/dashboard/:path*"] };