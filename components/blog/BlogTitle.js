"use client"; 
// این فایل باید در سمت کلاینت اجرا شود چون از state و رویداد کلیک استفاده می‌کند

import { useBlog } from "@/context/blog"; 
// گرفتن context بلاگ برای دسترسی به متغیر title و تابع setTitle

export default function BlogTitle({ onNextStep }) {
  // گرفتن مقدار title و تابع setTitle از context
  const { title, setTitle } = useBlog();

  return (
    <>
      {/* ورودی عنوان بلاگ، با عرض مناسب در وسط صفحه */}
      <div className="col-lg-6 offset-lg-3">
        <input
          type="text" // نوع input: متن
          value={title} // مقدار فعلی عنوان (state)
          onChange={(e) => setTitle(e.target.value)} // به‌روزرسانی مقدار هنگام تایپ کاربر
          className="form-control p-5 mb-5" // استایل Bootstrap برای زیبا‌سازی input
          placeholder="عنوان بلاگ" // متن راهنمایی داخل فیلد (به فارسی)
        />
      </div>

      {/* دکمه مرحله بعد برای رفتن به مرحله بعد */}
      <div className="d-flex justify-content-center my-4">
        <button
          className="btn btn-outline-primary p-5 col-6 mb-5" // دکمه آبی با padding زیاد
          onClick={onNextStep} // کلیک روی دکمه، کاربر را به مرحله بعد می‌برد
          disabled={!title?.trim()} // اگر چیزی در عنوان نوشته نشده باشد، دکمه غیرفعال است
        >
          مرحله بعد
        </button>
      </div>
    </>
  );
}