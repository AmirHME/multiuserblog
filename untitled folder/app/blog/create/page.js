"use client"; 
// اعلام اینکه این فایل در سمت کلاینت اجرا شود (ضروری در Next.js برای استفاده از هوک‌ها)

import { useEffect } from "react"; 
// ایمپورت useEffect برای اجرای کد هنگام mount شدن یا تغییرات

import { useRouter, useSearchParams } from "next/navigation"; 
// ایمپورت ابزارهای Router برای تغییر آدرس و گرفتن پارامترهای URL

import { useSession } from "next-auth/react";

import { useBlog } from "@/context/blog"; 
// گرفتن state و توابع از context سراسری بلاگ

// ایمپورت کامپوننت‌های مربوط به مراحل فرم ساخت بلاگ
import BlogTitle from "@/components/blog/BlogTitle"; // مرحله ۱: عنوان بلاگ
import BlogContent from "@/components/blog/BlogContent"; // مرحله ۲: محتوای بلاگ
import BlogTags from "@/components/blog/BlogTags"; // مرحله ۳: انتخاب تگ‌ها
import FeaturedImage from "@/components/blog/FeaturedImage"; // مرحله ۴: آپلود تصویر شاخص
import ReviewAndSubmit from "@/components/blog/ReviewAndSubmit"; // مرحله ۵: بررسی و انتشار

export default function BlogCreatePage() {
  // گرفتن مقادیر موردنیاز از context
  const {
    title,              // عنوان بلاگ
    markdown,           // محتوای بلاگ (markdown)
    selectedTags,       // تگ‌های انتخاب شده توسط کاربر
    featuredImage,      // تصویر شاخص آپلود شده
    step,               // مرحله فعلی فرم
    setStep,            // تابع تغییر مرحله
    handleNextStep,     // رفتن به مرحله بعد
    handlePrevStep,     // برگشت به مرحله قبل
    current,            // تابعی برای نمایش تیک کنار مراحل تکمیل‌شده
  } = useBlog();

  const { update } = useSession();

  const router = useRouter(); // گرفتن router برای تغییر آدرس URL
  const searchParams = useSearchParams(); // گرفتن query params از آدرس

  // تابعی برای قرار دادن شماره مرحله فعلی در URL
  const updateStepInURL = (stepNumber) => {
    router.push(`/blog/create?step=${stepNumber}`); // مثل: /blog/create?step=3
  };

  // هر وقت مقدار step تغییر کند، آن را در URL بروز کن
  useEffect(() => {
    updateStepInURL(step);
  }, [step]); // اجرا فقط زمانی که step تغییر کند

  // هنگام لود اولیه، مقدار مرحله را از query params بخوان و به state بده
  useEffect(() => {
    const stepFromQuery = searchParams.get("step"); // گرفتن مقدار ?step از آدرس
    if (stepFromQuery !== null) {
      const stepNumber = parseInt(stepFromQuery, 10); // تبدیل به عدد
      if (!isNaN(stepNumber)) {
        setStep(stepNumber); // مقداردهی اولیه به state مرحله
      }
    }
  }, []); // فقط یک بار اجرا در mount اولیه

  return (
    <>
      {/* نوار مراحل بالای صفحه - قابل کلیک برای پرش به هر مرحله */}
      <div className="container my-5">
        <div className="d-flex justify-content-between lead pointer">
          {/* مرحله اول: عنوان */}
          <div onClick={() => setStep(1)}>
            {current(1, title?.trim())} عنوان بلاگ
          </div>

          {/* مرحله دوم: محتوا */}
          <div onClick={() => setStep(2)}>
            {current(2, markdown?.trim().length > 60)} محتوا
          </div>

          {/* مرحله سوم: تگ‌ها */}
          <div onClick={() => setStep(3)}>
            {current(3, selectedTags?.length > 0)} تگ‌ ها
          </div>

          {/* مرحله چهارم: تصویر شاخص */}
          <div onClick={() => setStep(4)}>
            {current(4, featuredImage)} تصویر شاخص
          </div>

          {/* مرحله پنجم: بررسی نهایی */}
          <div onClick={() => setStep(5)}>
            {current(5)} بررسی و انتشار
          </div>
        </div>
      </div>

      {/* نمایش کامپوننت مربوط به هر مرحله بر اساس مقدار step */}
      {step === 1 && <BlogTitle onNextStep={handleNextStep} />} 
      {/* اگر مرحله ۱ بود، فرم عنوان نمایش داده شود */}

      {step === 2 && (
        <BlogContent
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
        />
      )}
      {/* اگر مرحله ۲ بود، فرم محتوا نمایش داده شود */}

      {step === 3 && (
        <BlogTags
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
        />
      )}
      {/* اگر مرحله ۳ بود، فرم تگ‌ها نمایش داده شود */}

      {step === 4 && (
        <FeaturedImage
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
        />
      )}
      {/* اگر مرحله ۴ بود، فرم آپلود تصویر شاخص نمایش داده شود */}

      {step === 5 && <ReviewAndSubmit onPrevStep={handlePrevStep} onBlogCreated={update} />}
      {/* اگر مرحله ۵ بود، کامپوننت بررسی نهایی و دکمه انتشار نمایش داده شود */}
    </>
  );
}
