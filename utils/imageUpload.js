// فایل utils/imageUpload.js

// ایمپورت کتابخانه Resizer برای فشرده‌سازی و تبدیل به base64
import Resizer from "react-image-file-resizer";
import toast from "react-hot-toast";

// تابع اصلی برای بارگذاری تصویر
export const imageUpload = async (file) => {
  return new Promise((resolve, reject) => {
    // تبدیل فایل ورودی به Base64 با استفاده از Resizer
    Resizer.imageFileResizer(
      file,               // فایل تصویر ورودی
      1280,              // عرض هدف تصویر (پیکسل)
      720,               // ارتفاع هدف تصویر (پیکسل)
      "JPEG",            // فرمت خروجی تصویر
      100,               // کیفیت تصویر (درصد)
      0,                 // درجه چرخش (۰ = بدون چرخش)
      async (uri) => {   // تابعی که بعد از تبدیل تصویر اجرا می‌شود
        try {
          // ارسال تصویر Base64 به API سمت سرور
          const response = await fetch(`/api/crud/uploads`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: uri }),
          });

          // بررسی موفقیت‌آمیز بودن پاسخ
          if (response.ok) {
            const data = await response.json();
            resolve(data?.url); // بازگرداندن URL تصویر آپلودشده
          } else {
            reject(new Error("Image upload failed"));
            toast.error("Image upload failed");
          }
        } catch (error) {
          reject(error);
        }
      },
      "base64" // نوع خروجی به صورت Base64
    );
  });
};