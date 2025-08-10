"use client"; 
// مشخص می‌کند که این کامپوننت باید در سمت کلاینت اجرا شود

import React from "react"; 
// وارد کردن ری‌اکت برای تعریف کامپوننت

import MarkdownIt from "markdown-it"; 
// ایمپورت کتابخانه‌ای برای تبدیل متن markdown به HTML

import MdEditor from "react-markdown-editor-lite"; 
// ایمپورت ویرایشگر markdown

import "react-markdown-editor-lite/lib/index.css"; 
// ایمپورت استایل پیش‌فرض برای ویرایشگر

import hljs from "highlight.js"; 
// برای هایلایت کردن کدها در داخل markdown

import { imageUpload } from "@/utils/imageUpload"; 
// تابع آپلود تصویر (مثلاً به Cloudinary)

import { useBlog } from "@/context/blog"; 
// گرفتن title و markdown و توابع به‌روزرسانی از context

// فایل آماده‌شده برای رندر markdown با highlight
import md from "@/utils/md";


// تعریف کامپوننت BlogContent که بین دو مرحله قرار دارد
export default function BlogContent({ onNextStep, onPrevStep }) {
  // گرفتن داده‌ها از context
  const { title, setTitle, markdown, setMarkdown } = useBlog();

  return (
    <div>
      {/* بخش ویرایشگر متن بلاگ */}
      <MdEditor
        value={markdown} // مقدار فعلی متن که در context ذخیره شده
        style={{ height: "80vh"}} // ارتفاع ویرایشگر در صفحه
        onChange={({ text }) => setMarkdown(text)} // به‌روزرسانی state هنگام تغییر محتوا
        renderHTML={(text) => md.render(text)} // رندر HTML خروجی با markdown-it
        onImageUpload={(file) => imageUpload(file)} // آپلود تصویر با استفاده از تابع imageUpload
        placeholder="وبلاگ خود را بنویسید" // متن راهنما در حالت خالی
      />

      {/* دکمه‌های مرحله قبلی و بعدی */}
      <div className="d-flex justify-content-center my-4">
        <button
          className="btn btn-outline-primary p-5 col-6 my-5 me-1"
          onClick={onPrevStep} // کلیک برای برگشت به مرحله قبل (BlogTitle)
        >
          قبلی
        </button>

        <button
          className="btn btn-outline-primary p-5 col-6 my-5 ms-1"
          onClick={onNextStep} // کلیک برای رفتن به مرحله بعدی (Tags)
          disabled={!markdown?.trim()} // اگر متن خالی باشد، دکمه غیرفعال می‌شود
        >
          بعدی
        </button>
      </div>
    </div>
  );
}
