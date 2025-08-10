// فایل: utils/helpers.js
import md from "@/utils/md";
// ایمپورت توابع موردنیاز برای session
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export function createExcerpt(content) {
  // تبدیل markdown به HTML
  const htmlContent = md.render(content);

  // حذف تصاویر و تبدیل تیترها و نقل‌قول‌ها به پاراگراف
  const excerpt = htmlContent
    .replace(/<img.*?>/g, "")
    .replace(/<(h[1-6]|blockquote).*?>/g, "<p>")
    .substring(0, 160);

  // حذف تگ ناقص در انتها و افزودن "..." در صورت لزوم
  return (
    excerpt.replace(/<[^>]*$/, "") + (htmlContent.length > 160 ? "..." : "")
  );
}

// تابعی برای گرفتن کاربر لاگین‌شده فعلی از session سمت سرور
export const currentUser = async () => {
  const session = await getServerSession(authOptions);
  return session.user;
};
