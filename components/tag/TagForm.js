// components/tag/TagForm
"use client"; // این خط به Next.js می‌گوید که این کامپوننت باید در سمت کلاینت اجرا شود چون از useState استفاده می‌کند.

import { useState } from "react"; // از هوک useState برای مدیریت وضعیت داخلی کامپوننت استفاده می‌کنیم.
import { useBlog } from "@/context/blog";
import TagList from "./TagList"; // کامپوننت لیست تگ‌ها را وارد می‌کنیم تا در اینجا نمایش دهیم.
export default function TagForm() {
  // تعریف state محلی به نام name برای ذخیره مقدار ورودی ایجاد تگ
  const {
    tagName,
    setTagName,
    tags,
    setTags,
    tagCreate,
    searchTerm,
    setSearchTerm,
  } = useBlog();
  // تابعی که هنگام ارسال فرم جستجو (Filter tags) فراخوانی می‌شود

  return (
    <>
      {/* ردیفی که شامل دو فرم است: فرم جستجو و فرم ایجاد تگ */}
      <div className="row mt-3 mb-5">
        {/* ستون اول: فرم جستجو */}
        <div className="col-lg-6">
          <input
            type="search"
            className="form-control p-5"
            placeholder="فیلتر تگ ها" // اینجا کاربر می‌تواند اسم تگ‌ها را برای فیلتر وارد کند
            value={searchTerm} // مقدار ورودی از state searchTerm گرفته می‌شود
            onChange={(e) => setSearchTerm(e.target.value)} // هنگام تغییر ورودی، state به‌روزرسانی می‌شود
            // اینجا کاربر می‌تواند تگ‌ها را بر اساس نام فیلتر کند
            // به‌عنوان مثال، اگر کاربر "javascript" را وارد کند، فقط تگ‌هایی که شامل این عبارت هستند نمایش داده می‌شوند
            // این ویژگی به کاربر اجازه می‌دهد تا تگ‌ها را بر اساس نامشان فیلتر کند
          />
        </div>

        {/* ستون دوم: فرم ایجاد تگ جدید */}
        <div className="col-lg-6">
          <form onSubmit={tagCreate}>
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              // هنگام تغییر ورودی، state به‌روزرسانی می‌شود
              placeholder="تگ جدید" // اینجا کاربر نام تگ جدید را وارد می‌کند
              className="form-control p-5"
            />
          </form>
        </div>
      </div>

      <TagList />
    </>
  );
}
