
// اعلام اینکه این فایل باید فقط در سمت کلاینت اجرا شود (ویژه App Router در Next.js)
"use client";

// ایمپورت کتابخانه‌های موردنیاز React
import React, { useState , useEffect } from "react";

// ایمپورت موتور رندر markdown
import MarkdownIt from "markdown-it";

// ایمپورت ادیتور گرافیکی markdown
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css"; // استایل پیش‌فرض ادیتور

// ایمپورت کتابخانه highlight.js برای های‌لایت کدها
import hljs from "highlight.js";
import "highlight.js/styles/monokai.css"; // استایل تیره برای کدها

// ایمپورت فایل CSS دلخواه برای حالت دارک ادیتور
import editorDarkCss from "@/utils/editorDarkCss";

// ایمپورت context برای خواندن حالت تم (روشن/تاریک)
import  { useTheme }  from "@/context/theme";

// ایمپورت تابع آپلود عکس
import { imageUpload } from "@/utils/imageUpload";


// تعریف کامپوننت اصلی فرم بلاگ
export default function MarkdownEditor() {

  // گرفتن مقدار theme از context (مقدار آن می‌تواند "light" یا "dark" باشد)
  const { theme } = useTheme();

  // تعریف state برای عنوان و محتوای بلاگ
  const [title, setTitle] = useState(""); // state برای نگهداری عنوان بلاگ
  const [markdown, setMarkdown] = useState(""); // state برای نگهداری محتوای markdown بلاگ

  // اعمال استایل مخصوص حالت دارک روی ادیتور در صورت تغییر theme
  useEffect(() => {
    // ساخت یک عنصر style جدید برای اعمال استایل‌های سفارشی
    const customStyle = document.createElement("style");
    customStyle.classList.add("editor-dark-theme"); // اضافه کردن کلاس برای شناسایی آسان‌تر
    customStyle.innerHTML = editorDarkCss; // قرار دادن محتوای CSS سفارشی

    // جستجو برای استایل دارک موجود در head صفحه
    const existingStyle = document.querySelector(".editor-dark-theme");

    // اگر تم "dark" باشد و استایل دارک وجود نداشته باشد، آن را به head اضافه کن
    if (theme === "dark") {
      if (!existingStyle) {
        document.head.appendChild(customStyle);
      }
    } else { // اگر تم "light" باشد و استایل دارک وجود داشته باشد، آن را حذف کن
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    }
  }, [theme]); // این useEffect هر بار که مقدار theme تغییر کند، اجرا می‌شود

  // هنگام بارگذاری اولیه کامپوننت: بازیابی محتوا از localStorage
  useEffect(() => {
    // گرفتن عنوان و محتوای ذخیره شده از localStorage
    const savedTitle = localStorage.getItem("savedTitle");
    const savedMarkdown = localStorage.getItem("savedMarkdown");

    // اگر هر کدام از موارد بالا ذخیره شده باشند، آن‌ها را در state کامپوننت قرار بده
    if (savedTitle || savedMarkdown) {
      setTitle(savedTitle);
      setMarkdown(savedMarkdown);
    }
  }, []); // این useEffect فقط یک بار هنگام mount شدن کامپوننت اجرا می‌شود

  // هر زمان که عنوان یا محتوای markdown تغییر کند، در localStorage ذخیره شود
  useEffect(() => {
    // ذخیره کردن عنوان و محتوای markdown در localStorage
    localStorage.setItem("savedTitle", title);
    localStorage.setItem("savedMarkdown", markdown);
  }, [title, markdown]); // این useEffect هر بار که title یا markdown تغییر کنند، اجرا می‌شود

  

  // پیکربندی markdown-it برای پشتیبانی از های‌لایت کد
  const md = new MarkdownIt({
    highlight: (str, lang) => { // تابع highlight برای های‌لایت کردن بلاک‌های کد
      // تعیین زبان کد: اگر زبان مشخص شده باشد و توسط highlight.js پشتیبانی شود، از آن استفاده کن، در غیر این صورت از "js" استفاده کن
      const language = lang && hljs.getLanguage(lang) ? lang : "js";
      try {
        // های‌لایت کردن کد با استفاده از highlight.js
        const highlightedCode = hljs.highlight(language, str, true).value;
        // برگرداندن کد های‌لایت شده در تگ‌های <pre> و <code>
        return `<pre class="hljs"><code>${highlightedCode}</code></pre>`;
      } catch (error) {
        return ""; // اگر خطایی در های‌لایت پیش آمد، مقدار خالی برگردان
      }
    },
  });

  // رندر نهایی کامپوننت
  return (
    <div>
      {/* فیلد عنوان بلاگ */}
      <input
        type="text"
        value={title} // مقدار فعلی عنوان
        onChange={(e) => setTitle(e.target.value)} // به‌روزرسانی state عنوان هنگام تغییر ورودی
        className="form-control p-5 mb-5" // کلاس‌های CSS برای استایل‌دهی
        placeholder="عنوان وبلاگ" // متن placeholder فیلد ورودی
      />

      {/* ادیتور گرافیکی markdown */}
      <MdEditor
        value={markdown} // مقدار فعلی محتوای markdown
        style={{ height: "80vh" }} // تنظیم ارتفاع ادیتور
        onChange={({ text }) => setMarkdown(text)} // به‌روزرسانی state markdown هنگام تغییر محتوا
        renderHTML={(text) => md.render(text)}     // استفاده از markdown-it برای رندر کردن HTML از markdown برای پیش‌نمایش
        onImageUpload={(file) => imageUpload(file)} // تابع فراخوانی شده هنگام آپلود تصویر توسط کاربر
      />
    </div>
  );
}


