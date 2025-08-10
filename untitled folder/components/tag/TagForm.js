// components/tag/TagForm
"use client"; // این خط به Next.js می‌گوید که این کامپوننت باید در سمت کلاینت اجرا شود چون از useState استفاده می‌کند.

import { useState } from "react"; // از هوک useState برای مدیریت وضعیت داخلی کامپوننت استفاده می‌کنیم.
import { useBlog } from "@/context/blog";
import TagList from "./TagList"; // کامپوننت لیست تگ‌ها را وارد می‌کنیم تا در اینجا نمایش دهیم.
import toast from "react-hot-toast"; // برای نمایش پیام‌های هشدار و موفقیت استفاده می‌کنیم.
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
    selectedTags,
    setSelectedTags,
  } = useBlog();
  // تابعی که هنگام ارسال فرم جستجو (Filter tags) فراخوانی می‌شود


// تابعی که هنگام فشار دادن Enter در فیلد جستجو اجرا میشه
const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // از رفتار پیش‌فرض جلوگیری می‌کنیم (مثلاً ارسال فرم)

    // پیدا کردن اولین تگی که شامل متن جستجو باشه (case-insensitive)
    const matchingTag = tags.find((t) =>
      t?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
    );

    if (matchingTag) {
      handleTagSelect(matchingTag); // اگر تگ پیدا شد، اون رو انتخاب کن
      setSearchTerm(""); // بعدش ورودی رو پاک کن
    }
  }
};





const handleTagSelect = (tag) => {
  // بررسی اینکه تگ قبلاً انتخاب نشده
  if (selectedTags.some((selectedTag) => selectedTag._id === tag._id)) {
    toast.error("این تگ قبلاً انتخاب شده");
    return;
  }

  // حداکثر ۵ تگ مجاز
  if (selectedTags.length >= 5) {
    toast.error("حداکثر ۵ تگ مجاز است");
    return;
  }

  // اضافه کردن تگ
  setSelectedTags([tag, ...selectedTags]);

  // ذخیره در localStorage
  localStorage.setItem(
    "selectedTags",
    JSON.stringify([tag, ...selectedTags])
  );
};





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
            onKeyDown={handleKeyDown} // اینجا می‌توانیم یک تابع برای مدیریت رویداد کلید پایین (keydown) اضافه کنیم
            // این تابع می‌تواند برای انجام عملیاتی مانند ارسال فرم یا فیلتر کردن تگ‌ها با فشردن کلید Enter استفاده شود
            // به‌عنوان مثال، اگر کاربر کلید Enter را فشار دهد، می‌توانیم تگ‌ها را بر اساس مقدار ورودی فیلتر کنیم
            // این ویژگی به کاربر اجازه می‌دهد تا با فشردن کلید Enter، فیلتر تگ‌ها را اعمال کند
            autoFocus={true} // اینجا با استفاده از autoFocus، فیلد ورودی به‌طور خودکار در هنگام بارگذاری صفحه فوکوس می‌شود
            // این ویژگی باعث می‌شود که کاربر بلافاصله بتواند شروع به تایپ کند
            // و نیازی به کلیک روی فیلد ورودی نباشد
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





