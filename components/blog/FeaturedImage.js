"use client"; 
// مشخص می‌کند که این کامپوننت باید فقط در سمت کلاینت اجرا شود

import { useEffect } from "react"; 
// برای بارگذاری اطلاعات از localStorage هنگام mount شدن کامپوننت

import { useBlog } from "@/context/blog"; 
// گرفتن state و توابع مربوطه از context بلاگ

import { imageUpload } from "@/utils/imageUpload"; 
// تابعی که مسئول آپلود تصویر در Cloudinary یا سرور است

// تعریف کامپوننت تصویر شاخص
export default function FeaturedImage({ onNextStep, onPrevStep }) {
  // گرفتن مقادیر لازم از context
  const {
    featuredImage,        // آدرس نهایی تصویر آپلودشده
    setFeaturedImage,     // تابع به‌روزرسانی آدرس تصویر
    uploadingImage,       // فلگ برای وضعیت در حال آپلود بودن
    setUploadingImage,    // تابع به‌روزرسانی وضعیت آپلود
    imagePreview,         // پیش‌نمایش تصویر انتخاب‌شده توسط کاربر
    setImagePreview,      // تابع به‌روزرسانی preview
  } = useBlog();

  // زمانی که کامپوننت بارگذاری می‌شود، اطلاعات را از localStorage لود کن
  useEffect(() => {
    const storedImagePreview = localStorage.getItem("imagePreview"); // preview ذخیره‌شده
    const storedImageUrl = localStorage.getItem("featuredImage");     // آدرس نهایی ذخیره‌شده

    if (storedImagePreview) setImagePreview(storedImagePreview); // نمایش preview
    if (storedImageUrl) setFeaturedImage(storedImageUrl);         // تنظیم آدرس تصویر
  }, []);

  // هندل کردن انتخاب و آپلود تصویر
  const handleImageUpload = async (e) => {
    const selectedImage = e.target.files[0]; // گرفتن فایل انتخاب‌شده

    if (!selectedImage) return; // اگر تصویری انتخاب نشده بود، خروج

    // ساختن preview با FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result); // نمایش پیش‌نمایش
      localStorage.setItem("imagePreview", event.target.result); // ذخیره در localStorage
    };
    reader.readAsDataURL(selectedImage); // خواندن فایل به‌صورت Base64

    // شروع عملیات آپلود
    setUploadingImage(true);
    try {
      const imageUrl = await imageUpload(selectedImage); // آپلود در سرور و گرفتن URL
      localStorage.setItem("featuredImage", imageUrl);   // ذخیره در localStorage
      setFeaturedImage(imageUrl);                        // ذخیره در context
    } catch (err) {
      console.log(err); // در صورت خطا نمایش در کنسول
    } finally {
      setUploadingImage(false); // پایان آپلود
    }
  };

  return (
    // کل بخش مربوط به تصویر شاخص در یک کانتینر مرکزی
    <div className="container">

      {/* اگر تصویری انتخاب شده باشد، نمایش آن در مرکز صفحه */}
      {imagePreview && (
        <div className="col-lg-8 offset-lg-2">
          <img
            src={imagePreview}                 // نمایش پیش‌نمایش تصویر
            alt="Preview"                      // متن جایگزین
            className="img img-fluid rounded"  // استایل بوت‌استرپی برای زیبایی
          />
        </div>
      )}

      {/* دکمه انتخاب و آپلود تصویر */}
      <div className="d-flex justify-content-center mt-4">
        <label
          className={`btn btn-outline-secondary p-5 col-lg-6 ${
            uploadingImage ? "disabled" : ""
          }`}
        >
          {/* متن دکمه بسته به وضعیت آپلود */}
          {uploadingImage ? "در حال آپلود..." : "آپلود تصویر شاخص"}

          {/* input واقعی که هنگام انتخاب فایل، trigger می‌شود */}
          <input
            type="file"                    // نوع فایل ورودی
            accept="image/*"               // فقط فایل تصویری مجاز است
            hidden                         // مخفی است، چون label کلیک‌پذیر است
            onChange={handleImageUpload}   // تابع آپلود هنگام انتخاب فایل
          />
        </label>
      </div>

      {/* دکمه‌های مرحله قبلی و بعدی */}
      <div className="d-flex justify-content-center my-4">
        <button
          className="btn btn-outline-primary p-5 col-6 my-5 me-1"
          onClick={onPrevStep} // رفتن به مرحله قبل
        >
          قبلی
        </button>

        <button
          className="btn btn-outline-primary p-5 col-6 my-5 ms-1"
          onClick={onNextStep} // رفتن به مرحله بعد
          disabled={!featuredImage} // فقط وقتی فعال است که تصویر انتخاب شده باشد
        >
          بعدی
        </button>
      </div>
    </div>
  );
}