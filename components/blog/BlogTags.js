"use client"; 
// این فایل باید در سمت کلاینت اجرا شود چون از state و context استفاده می‌کند

import TagForm from "@/components/tag/TagForm"; 
// کامپوننتی که تگ‌ها را از سرور می‌گیرد و امکان انتخاب فراهم می‌کند


import { useBlog } from "@/context/blog"; 
// گرفتن selectedTags از context

// تعریف کامپوننت مرحله سوم: انتخاب تگ‌ها
export default function BlogTags({ onNextStep, onPrevStep }) {
  const { selectedTags } = useBlog(); 
  // گرفتن لیست تگ‌های انتخاب‌شده از context

  return (
    <div>
      <TagForm /> {/* فرم انتخاب تگ‌ها */}

      {/* دکمه‌های جابه‌جایی بین مراحل */}
      <div className="d-flex justify-content-center my-4">
        <button
          className="btn btn-outline-primary p-5 col-6 my-5 me-1"
          onClick={onPrevStep} // کلیک برای بازگشت به مرحله قبلی
        >
          قبلی
        </button>

        <button
          className="btn btn-outline-primary p-5 col-6 my-5 ms-1"
          onClick={onNextStep} // کلیک برای رفتن به مرحله بعدی
          disabled={selectedTags?.length < 1} // فقط وقتی فعال می‌شود که حداقل یک تگ انتخاب شده باشد
        >
          بعدی
        </button>
      </div>
    </div>
  );
}




