// components/tag/TagForm
"use client";  // این خط به Next.js می‌گوید که این کامپوننت باید در سمت کلاینت اجرا شود چون از useState استفاده می‌کند.

import { useState } from "react";  // از هوک useState برای مدیریت وضعیت داخلی کامپوننت استفاده می‌کنیم.
import { useBlog } from "@/context/blog";

export default function TagForm() {
  // تعریف state محلی به نام name برای ذخیره مقدار ورودی ایجاد تگ
  const { tagName, setTagName, tags, setTags, tagCreate } = useBlog();
  // تابعی که هنگام ارسال فرم جستجو (Filter tags) فراخوانی می‌شود
  const handleSearch = (e) => {
    e.preventDefault();  // جلوگیری از رفرش شدن صفحه هنگام ارسال فرم
    console.log("search");  // فعلاً فقط در کنسول لاگ می‌کند، اینجا می‌شود بعداً کد فیلتر کردن تگ‌ها را نوشت
  };

  // تابعی که هنگام ارسال فرم ایجاد تگ جدید فراخوانی می‌شود
  const handleTag = (e) => {
    e.preventDefault();  // جلوگیری از رفرش شدن صفحه
    console.log("tag");  // فعلاً فقط در کنسول لاگ می‌کند، اینجا می‌توان بعداً کد ذخیره تگ جدید را اضافه کرد
  };

  return (
    <>
      {/* ردیفی که شامل دو فرم است: فرم جستجو و فرم ایجاد تگ */}
      <div className="row mt-3 mb-5">
        
        {/* ستون اول: فرم جستجو */}
        <div className="col-lg-6">
          <form onSubmit={handleSearch}>
            <input
              type="search"
              className="form-control p-5"
              placeholder="فیلتر تگ ها"  // اینجا کاربر می‌تواند اسم تگ‌ها را برای فیلتر وارد کند
            />
          </form>
        </div>

        {/* ستون دوم: فرم ایجاد تگ جدید */}
        <div className="col-lg-6">
          <form onSubmit={tagCreate}>
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
                // هنگام تغییر ورودی، state به‌روزرسانی می‌شود
              placeholder="تگ جدید"  // اینجا کاربر نام تگ جدید را وارد می‌کند
              className="form-control p-5"
            />
          </form>
        </div>

      </div>

      {/* ردیفی که شامل دکمه‌های تگ‌هاست */}
      <div className="row d-flex justify-content-center align-items-center">
        <div
          className="col custom-scrollbar"  // کلاس سفارشی برای اسکرول بار
          style={{ maxHeight: "280px", overflow: "auto" }}  // محدودیت ارتفاع با اسکرول افقی و عمودی
        >
          {/* ساخت 100 دکمه تگ به صورت نمونه با عددگذاری */}
          {Array.from({ length: 100 }).map((_, index) => (
            <button
              key={index}
              className="btn btn-lg btn-outline-secondary m-1"  // دکمه‌های بزرگ با فاصله کوچک کنار هم
            >
              {`Tag ${index + 1}`}  {/* متن دکمه به صورت Tag 1، Tag 2، ... */}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}






