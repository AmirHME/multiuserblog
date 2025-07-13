"use client"; 
// مشخص می‌کنه این کامپوننت باید سمت کلاینت اجرا بشه

import React from "react"; 
// ایمپورت React

import MarkdownIt from "markdown-it"; 
// کتابخانه markdown-it برای رندر محتوای markdown

import MdEditor from "react-markdown-editor-lite"; 
// ویرایشگر markdown

import "react-markdown-editor-lite/lib/index.css"; 
// استایل مربوط به ویرایشگر

import hljs from "highlight.js"; 
// کتابخانه highlight.js برای هایلایت کردن کدها

import { imageUpload } from "@/utils/imageUpload"; 
// تابع آپلود تصویر

import { useBlog } from "@/context/blog"; 
// گرفتن title و markdown از context

export default function BlogForm() {
  const { title, setTitle, markdown, setMarkdown } = useBlog(); 
  // گرفتن state از context به‌جای تعریف درون این کامپوننت

  const md = new MarkdownIt({
    highlight: (str, lang) => {
      const language = lang && hljs.getLanguage(lang) ? lang : "js"; 
      // بررسی زبان کد

      try {
        const highlightedCode = hljs.highlight(language, str, true).value; 
        // هایلایت کردن کد

        return `<pre class="hljs"><code>${highlightedCode}</code></pre>`; 
        // بازگرداندن کد HTML هایلایت‌شده
      } catch (error) {
        return ""; 
        // اگر خطا رخ داد، چیزی نمایش نده
      }
    },
  });

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)} 
        // به‌روزرسانی title از طریق context
        className="form-control p-5 mb-5"
        placeholder="عنوان وبلاگ"
      />

      <MdEditor
        value={markdown}
        style={{ height: "80vh" }}
        onChange={({ text }) => setMarkdown(text)} 
        // به‌روزرسانی markdown از طریق context
        renderHTML={(text) => md.render(text)} 
        // تبدیل markdown به HTML با markdown-it
        onImageUpload={(file) => imageUpload(file)} 
        // آپلود تصویر
        placeholder="وبلاگ خود را بنویسید"
      />
    </div>
  );
}
