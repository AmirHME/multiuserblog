// وارد کردن نوار ناوبری نویسنده که در بالای همه صفحات داشبورد نویسنده نمایش داده می‌شود
import AuthorNav from "@/components/nav/AuthorNav";

// تعریف لایه صفحات مربوط به نویسنده (تمام صفحات داخل dashboard/author از این layout استفاده می‌کنند)
export default function AuthorLayout({ children }) {
  return (
    <>
      {/* نمایش نوار ناوبری نویسنده */}
      <AuthorNav />

      {/* نمایش محتوای صفحه جاری (هر صفحه‌ای که داخل این layout قرار بگیرد) */}
      {children}
    </>
  );
}
