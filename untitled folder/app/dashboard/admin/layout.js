// این فایل layout عمومی برای بخش ادمین است
// تمام صفحات داخل مسیر /dashboard/admin در این چارچوب نمایش داده می‌شوند

import AdminNav from '@/components/nav/AdminNav'; // وارد کردن منوی مدیریت

// تعریف لایه‌ای برای صفحات ادمین
// ورودی آن children است، یعنی محتوای هر صفحه که در داخل layout نمایش داده می‌شود
export default function AdminLayout({ children }) {
  return (
    <>
      {/* نمایش نوار ناوبری ادمین در بالای صفحات */}
      <AdminNav />

      {/* نمایش محتوای داخلی هر صفحه که در این layout قرار می‌گیرد */}
      {children}
    </>
  );
}
