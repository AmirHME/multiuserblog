// context/blog
"use client";
// اعلام اینکه این فایل فقط در سمت کلاینت باید اجرا شود (ویژه App Router در Next.js)

import { createContext, useContext, useState, useEffect } from "react";
// ایمپورت ابزارهای Context API و هوک‌های React

import { useTheme } from "@/context/theme";
// گرفتن وضعیت تم (تاریک/روشن) از context مربوط به theme

import editorDarkCss from "@/utils/editorDarkCss";
// ایمپورت CSS دلخواه برای حالت تاریک ادیتور

import { toast } from "react-hot-toast";
// ایمپورت کتابخانه toast برای نمایش اعلان‌های پاپ‌آپ به کاربر

// ایجاد یک context جدید برای بلاگ
const BlogContext = createContext();

// تعریف Provider که همه stateها رو به صورت global در اختیار فرزندان قرار می‌ده
export const BlogProvider = ({ children }) => {
  const { theme } = useTheme(); // گرفتن وضعیت theme از context theme

  // state برای نگهداری عنوان بلاگ
  const [title, setTitle] = useState("");

  // state برای نگهداری محتوای markdown بلاگ
  const [markdown, setMarkdown] = useState("");

  // state برای نام تگ جدید که کاربر وارد می‌کنه
  const [tagName, setTagName] = useState("");

  // state برای نگهداری لیست تگ‌ها (آرایه‌ای از تگ‌ها)
  const [tags, setTags] = useState([]);


  // context/blog
// featured image
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);


const [searchTerm, setSearchTerm] = useState(""); // state برای نگهداری عبارت جستجو

const [selectedTags, setSelectedTags] = useState([]); // state برای نگهداری تگ‌های انتخاب‌شده 


  // useEffect برای مدیریت استایل دارک ادیتور وقتی theme تغییر می‌کنه
  useEffect(() => {
    const customStyle = document.createElement("style"); // ایجاد یک تگ <style>
    customStyle.classList.add("editor-dark-theme"); // افزودن کلاس برای شناسایی
    customStyle.innerHTML = editorDarkCss; // قرار دادن CSS دلخواه

    const existingStyle = document.querySelector(".editor-dark-theme"); // بررسی اینکه آیا قبلاً استایل اضافه شده یا نه

    if (theme === "dark") {
      if (!existingStyle) {
        document.head.appendChild(customStyle); // اگر تم تاریک بود و استایل نبود، اضافه کن
      }
    } else {
      if (existingStyle) {
        document.head.removeChild(existingStyle); // اگر تم روشن شد و استایل وجود داشت، حذف کن
      }
    }
  }, [theme]); // اجرا فقط زمانی که theme تغییر کند

  // هنگام بارگذاری اولیه، اطلاعات ذخیره‌شده در localStorage را بارگذاری کن
  useEffect(() => {
    const savedTitle = localStorage.getItem("savedTitle"); // دریافت عنوان ذخیره‌شده
    const savedMarkdown = localStorage.getItem("savedMarkdown"); // دریافت محتوای ذخیره‌شده

    if (savedTitle && savedMarkdown) {
      setTitle(savedTitle); // مقداردهی اولیه title
      setMarkdown(savedMarkdown); // مقداردهی اولیه markdown
    }
  }, []);

  // هر بار که title یا markdown تغییر کرد، آن را در localStorage ذخیره کن
  useEffect(() => {
    localStorage.setItem("savedTitle", title); // ذخیره عنوان در مرورگر
    localStorage.setItem("savedMarkdown", markdown); // ذخیره محتوای markdown در مرورگر
  }, [title, markdown]);

  // تابع ساخت تگ جدید که فعلاً فقط لاگ می‌گیرد
// فایل: context/blog.js

// تابع برای ارسال درخواست ایجاد تگ جدید
const tagCreate = async (e) => {
  e.preventDefault(); // جلوگیری از رفرش فرم

  try {
    // ارسال درخواست POST به API سمت سرور
    const response = await fetch(`/api/crud/tag`, {
      method: "POST",
      body: JSON.stringify({ name: tagName }), // ارسال name در بدنه
    });

    // خواندن پاسخ JSON
    const data = await response.json();

    if (!response.ok) {
      // اگر پاسخ موفق نبود، پیام خطا نمایش داده می‌شود
      toast.error(data?.err);
    } else {
      // اگر موفق بود: 
      // - تگ جدید را به ابتدای لیست اضافه کن
      setTags([data, ...tags]);
      // - مقدار ورودی را پاک کن
      setTagName("");
      // - اعلان موفقیت نمایش بده
      toast.success("تگ ساخته شد");
    }
  } catch (err) {
    // در صورت خطای شبکه یا برنامه‌نویسی، در کنسول چاپ شود
    console.log(err);
  }
};



// تابع حذف تگ از دیتابیس و رابط کاربری
const tagDelete = async (tagId) => {
  try {
    // ارسال درخواست DELETE به API
    const response = await fetch(`/api/crud/tag/${tagId}`, {
      method: "DELETE",
    });

    const data = await response.json(); // گرفتن پاسخ از سرور

    if (!response.ok) {
      // اگر پاسخ خطا بود، پیام خطا را نمایش بده
      toast.error(data?.err);
    } else {
      // اگر موفق بود:

      // حذف تگ از آرایه selectedTags (تگ‌های انتخاب‌شده توسط کاربر)
      const updatedSelectedTags = selectedTags.filter(
        (tag) => tag._id !== tagId
      );

      // بروزرسانی state‌ها
      setSelectedTags(updatedSelectedTags); // بروزرسانی selectedTags
      setTags(tags.filter((tag) => tag._id !== tagId)); // حذف از لیست کل تگ‌ها
      setTagName(""); // پاک کردن فیلد ورودی نام تگ
      toast.success("تگ حذف شد"); // نمایش پیام موفقیت
    }
  } catch (err) {
    console.log(err); // در صورت خطا در fetch، چاپ خطا در کنسول
  }
};


// فایل: context/blog.js

// تعریف تابع tagList برای گرفتن لیست تگ‌ها از سرور
const tagList = async () => {
  try {
    // ارسال درخواست GET به API سمت سرور
    const response = await fetch(`/api/tags`, {
      method: "GET",
    });

    // خواندن پاسخ JSON
    const data = await response.json();

    if (!response.ok) {
      // اگر پاسخ دارای خطا بود، نمایش خطا با toast
      toast.error(data?.err);
    } else {
      // ذخیره تگ‌ها در context (state سراسری)
      setTags(data);
    }
  } catch (err) {
    // چاپ خطا در کنسول در صورت خطای شبکه
    console.log(err);
  }
};




  // تابع ساخت بلاگ جدید که داده‌ها را لاگ می‌کند
  const blogCreate = async (e) => {
    e.preventDefault(); // جلوگیری از رفرش شدن فرم
    console.log("create blog", { title, markdown, tags }); // چاپ محتوای بلاگ در کنسول
  };

  // برگرداندن Provider و ارسال تمام stateها و توابع به فرزندان
  return (
    <BlogContext.Provider
      value={{
        title,          // عنوان بلاگ
        setTitle,       // تابع تغییر عنوان
        markdown,       // محتوای markdown
        setMarkdown,    // تابع تغییر محتوا
        tagName,        // نام تگ جدید
        setTagName,     // تابع تغییر تگ جدید
        tags,           // لیست تگ‌ها
        setTags,        // تابع به‌روزرسانی لیست تگ‌ها
        tagCreate,      // تابع ساخت تگ
        tagList,
        blogCreate,
        searchTerm,
        setSearchTerm,     // تابع ساخت بلاگ
        selectedTags,
        setSelectedTags,
        featuredImage,
        setFeaturedImage,
        imagePreview,
        setImagePreview,
        uploadingImage,
        setUploadingImage,
        tagDelete,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

// هوک سفارشی برای استفاده آسان‌تر از BlogContext
export const useBlog = () => useContext(BlogContext);