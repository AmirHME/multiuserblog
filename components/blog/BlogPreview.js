// فایل: blog/create/BlogPreview.js

"use client"; 
// مشخص می‌کنه که این کامپوننت باید در سمت کلاینت اجرا بشه

import React from "react"; 
// وارد کردن React برای تعریف کامپوننت

import { useBlog } from "@/context/blog"; 
// گرفتن اطلاعات بلاگ (title، markdown، تگ‌ها، تصویر) از context

import md from "@/utils/md"; 
// ایمپورت فایل آماده رندر markdown

import "highlight.js/styles/monokai.css"; 
// استایل هایلایت کدها (برای دارک‌مود)

import dayjs from "dayjs"; 
// برای مدیریت تاریخ

import relativeTime from "dayjs/plugin/relativeTime"; 
// برای فرمت‌دهی به تاریخ نسبی

import { useSession } from "next-auth/react"; 
// گرفتن اطلاعات کاربر لاگین‌شده

dayjs.extend(relativeTime); 
// فعال کردن افزونه relativeTime برای dayjs

export default function BlogPreview({ onNextStep }) {
  const { title, markdown, selectedTags, featuredImage } = useBlog(); 
  // گرفتن اطلاعات مورد نیاز از context بلاگ
  const { data } = useSession(); 
  // گرفتن session کاربر (برای گرفتن نام نویسنده)

  return (
    <div className="container">
      <div className="row">
        
        
        {/* نمایش تصویر شاخص در بالای بلاگ (اگر انتخاب شده باشد) */}
        {featuredImage && (
          <div className="text-center mb-4">
            <img 
              src={featuredImage} // آدرس تصویر شاخص
              alt="تصویر شاخص بلاگ" // متن جایگزین برای تصویر
              className="img-fluid rounded shadow" // کلاس‌های بوت‌استرپ برای زیبایی تصویر
              style={{ maxHeight: "400px", objectFit: "cover" }} // محدود کردن ارتفاع و برش بهتر تصویر
            />
          </div>
        )}

        {/* نمایش عنوان بلاگ */}
        <h1 className="fw-bold">{title}</h1>

        {/* نمایش تاریخ و نویسنده بلاگ */}
              <p className="text-secondary" dir="rtl">
        <span>منتشر شده در </span>
        <span>{dayjs(new Date()).format("YYYY/MM/DD - HH:mm")}</span>
        <span> توسط </span>
        <span>{data?.user?.name}</span>
      </p>

        {/* نمایش لیست تگ‌ها به‌صورت دکمه غیرفعال */}
        <div className="d-flex mb-4 flex-wrap">
          {selectedTags?.map((t) => (
            <button 
              key={t?._id} // کلید یونیک برای هر تگ
              className="btn btn-outline-primary me-2 mb-2" // استایل دکمه‌ها
              disabled // غیرفعال بودن دکمه‌ها
            >
              {t?.name} {/* نام تگ */}
            </button>
          ))}
        </div>

        {/* نمایش محتوای بلاگ که از markdown به HTML تبدیل شده */}
        <div className="markdown-preview">
          <div 
            dangerouslySetInnerHTML={{ __html: md.render(markdown) }} 
            // رندر HTML خروجی markdown
          />
        </div>
      </div>
    </div>
  );
}