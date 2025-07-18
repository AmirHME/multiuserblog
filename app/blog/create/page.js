"use client";
// به Next.js اعلام می‌کنه که این فایل در سمت کلاینت اجرا بشه، چون از state و رویداد استفاده می‌کنه

import { useBlog } from "@/context/blog"; // استفاده از context بلاگ برای دسترسی به تابع blogCreate
import { useState } from "react";         // ایمپورت useState برای مدیریت مراحل
import BlogContent from "@/components/blog/BlogContent"; // وارد کردن کامپوننت مرحله دوم (محتوای بلاگ)

import BlogTitle from "@/components/blog/BlogTitle"; // وارد کردن کامپوننت مرحله اول (عنوان بلاگ)\
import BlogTags from "@/components/blog/BlogTags"; // وارد کردن کامپوننت مرحله سوم (تگ‌ها)
import FeaturedImage from "@/components/blog/FeaturedImage";

export default function BlogCreatePage() {
  const { blogCreate } = useBlog(); // گرفتن تابع blogCreate از context برای ارسال نهایی اطلاعات

  // تعریف state مربوط به مرحله فعلی فرم (از مرحله ۱ شروع می‌کنیم)
  const [step, setStep] = useState(1);

  // رفتن به مرحله بعد
  const handleNextStep = () => setStep(step + 1);

  // برگشت به مرحله قبل (فعلاً استفاده نشده ولی مفیده برای مراحل بعد)
  const handlePrevStep = () => setStep(step - 1);

  // تابعی برای نمایش تیک مرحله اگر کاربر از اون عبور کرده باشه
  const current = (n) => (step >= n ? "✅ " : null);

  // بازگشت JSX صفحه
  return (
    <>
      {/* نمایش لیست مراحل به صورت افقی در بالای صفحه */}
      <div className="container my-5">
        <div className="d-flex justify-content-between lead">
          <div>{current(1)} عنوان بلاگ</div>
          <div>{current(2)} محتوا</div>
          <div>{current(3)} تگ‌ ها</div>
          <div>{current(4)} تصویر شاخص</div>
          <div>{current(5)} بررسی و انتشار</div>
        </div>
      </div>

      {/* اگر مرحله فعلی یک باشد، کامپوننت وارد کردن عنوان نمایش داده شود */}
      {step === 1 && <BlogTitle onNextStep={handleNextStep} />}
      {step === 2 && (<BlogContent onNextStep={handleNextStep} onPrevStep={handlePrevStep}/>)}
      {step === 3 && (<BlogTags onNextStep={handleNextStep} onPrevStep={handlePrevStep}/>)}
      {step === 4 && (<FeaturedImage onNextStep={handleNextStep} onPrevStep={handlePrevStep}/>)}

    </>
  );
}