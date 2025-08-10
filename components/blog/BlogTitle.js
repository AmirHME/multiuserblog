"use client";
// این کامپوننت باید در سمت کلاینت اجرا شود چون از هوک‌ها و state استفاده می‌کند

import { useBlog } from "@/context/blog";
// ایمپورت هوک useBlog برای دسترسی به context بلاگ

export default function BlogTitle({ onNextStep }) {
  // دریافت عنوان فعلی و تابع تنظیم عنوان از context
  const { title, setTitle } = useBlog();

  return (
    <>
      {/* کانتینر اصلی برای بخش عنوان با حفظ ساختار و ابعاد فعلی */}
      <div className="d-flex justify-content-center">
        <div className="col-lg-6">
          {/* اینپوت عنوان با حفظ تمام استایل‌های فعلی */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control p-5 mb-5 text-center" 
            placeholder="عنوان بلاگ"
            dir="rtl"
          />
        </div>
      </div>

      {/* کانتینر دکمه مرحله بعد با حفظ ساختار فعلی */}
      <div className="d-flex justify-content-center">
        <div className="col-lg-6">
          {/* دکمه با حفظ تمام مشخصات فعلی */}
          <button
            className="btn btn-outline-primary p-5 w-100 mb-5"
            onClick={onNextStep}
            disabled={!title?.trim()}
          >
            مرحله بعد
          </button>
        </div>
      </div>
    </>
  );
}