"use client"; 
// چون از useState و context استفاده می‌کنیم باید این کامپوننت در سمت کلاینت اجرا شود

import { useBlog } from "@/context/blog"; 
// گرفتن داده‌های مورد نیاز از context (مثل title، markdown، tags و ...)


import BlogPreview from "@/components/blog/BlogPreview";

export default function ReviewAndSubmit({ onPrevStep, update = false}) {
  // گرفتن توابع و مقادیر مورد نیاز از context
  const {
    title,           // عنوان بلاگ
    markdown,        // محتوای بلاگ
    selectedTags,    // تگ‌های انتخاب‌شده
    blogCreate,      // تابع ارسال نهایی بلاگ
    uploadingImage,
    blogUpdate  // وضعیت آپلود تصویر
  } = useBlog();

  return (
    <div className="container">
      {/* ردیف پیش‌نمایش بلاگ */}
      <div className="row">
        
        <p className="badge text-primary">پیش نمایش بلاگ</p>
         
        <BlogPreview />
         </div>
       {/* دکمه‌های مرحله قبلی و ارسال نهایی */}
      <div className="d-flex justify-content-center my-4">
        {/* دکمه برگشت به مرحله قبلی */}
        <button
          className="btn btn-outline-primary p-5 col-6 my-5 me-1"
          onClick={onPrevStep}
        >
          قبلی
        </button>

        {/* دکمه ارسال بلاگ */}
        <button
          className="btn btn-primary p-5 col-6 my-5 ms-1"
          onClick={update ? blogUpdate : blogCreate} // اجرای تابع ارسال هنگام کلیک
          disabled={
            !title?.trim() ||                // اگر عنوان خالی باشد
            markdown?.trim().length < 60 ||  // اگر محتوای بلاگ کمتر از ۶۰ کاراکتر باشد
            selectedTags?.length < 1 ||      // اگر تگی انتخاب نشده باشد
            uploadingImage                   // یا تصویر هنوز آپلود نشده باشد
          }
        >
          انتشار
        </button>
      </div>
    </div>
  );
}
