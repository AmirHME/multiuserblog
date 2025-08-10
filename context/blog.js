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

  // فرم چند مرحله ای
  // تعریف state مربوط به مرحله فعلی فرم (از مرحله ۱ شروع می‌کنیم)
  const [step, setStep] = useState(1);
    // رفتن به مرحله بعد
    const handleNextStep = () => setStep(step + 1);

    // برگشت به مرحله قبل (فعلاً استفاده نشده ولی مفیده برای مراحل بعد)
    const handlePrevStep = () => setStep(step - 1);
  
    // تابعی برای نمایش تیک مرحله اگر کاربر از اون عبور کرده باشه
    const current = (n, condition = true) =>
      step >= n && condition ? "✅ " : null;


  // context/blog
// featured image
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);


const [searchTerm, setSearchTerm] = useState(""); // state برای نگهداری عبارت جستجو

const [selectedTags, setSelectedTags] = useState([]); // state برای نگهداری تگ‌های انتخاب‌شده 


//blogs
// برای نگه‌داری لیست بلاگ‌های نویسنده
const [blogs, setBlogs] = useState([]);

// شماره صفحه جاری
const [page, setPage] = useState(1);

// تعداد کل صفحات موجود
const [totalPages, setTotalPages] = useState(0);


// update
const [id, setId] = useState(0); //added for blog update



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
// این useEffect هنگام بارگذاری اولیه اجرا می‌شود
useEffect(() => {
  // اگر در حالت ویرایش نباشیم (یعنی در حال ساخت بلاگ جدید باشیم)
  if (!id) {
    const savedTitle = localStorage.getItem("savedTitle"); // دریافت عنوان ذخیره‌شده
    const savedMarkdown = localStorage.getItem("savedMarkdown"); // دریافت محتوای ذخیره‌شده

    // اگر داده‌ها وجود داشت، آن‌ها را داخل state قرار بده
    if (savedTitle && savedMarkdown) {
      setTitle(savedTitle); // مقداردهی اولیه title
      setMarkdown(savedMarkdown); // مقداردهی اولیه markdown
    }
  }
}, []);

  // هر بار که title یا markdown تغییر کرد، آن را در localStorage ذخیره کن
// این useEffect هر بار که title یا markdown تغییر کند اجرا می‌شود
useEffect(() => {
  // فقط در حالت ساخت بلاگ جدید، اطلاعات را ذخیره کن
  if (!id) {
    localStorage.setItem("savedTitle", title); // ذخیره عنوان
    localStorage.setItem("savedMarkdown", markdown); // ذخیره محتوا
  }
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




  // تابعی برای ساخت بلاگ جدید و ارسال آن به API سرور
const blogCreate = async (e) => {
  e.preventDefault(); // جلوگیری از رفرش شدن فرم پس از ارسال

  try {
    // ارسال درخواست POST به مسیر API بک‌اند
    const response = await fetch(`/api/crud/blog`, {
      method: "POST", // نوع درخواست POST است چون داده ایجاد می‌کنیم
      body: JSON.stringify({
        title,                              // ارسال عنوان بلاگ
        content: markdown,                 // ارسال محتوای بلاگ (markdown)
        tags: selectedTags?.map((tag) => tag._id), // فقط شناسه تگ‌ها را ارسال می‌کنیم
        featuredImage,                     // ارسال تصویر شاخص
      }),
    });

    // دریافت پاسخ از سرور و تبدیل آن به JSON
    const data = await response.json();

    // اگر پاسخ موفق نبود، پیام خطا با toast نمایش داده می‌شود
    if (!response.ok) {
      toast.error(data?.err); // نمایش خطای برگشتی از سرور
    } else {
      // در صورت موفقیت:
      toast.success(`بلاگ "${data?.title}" با موفقیت ایجاد شد`);
      setStep(1);
      

      // حذف اطلاعات ذخیره‌شده در localStorage (برای جلوگیری از باقی ماندن اطلاعات قدیمی)
      localStorage.removeItem("savedTitle");
      localStorage.removeItem("savedMarkdown");
      localStorage.removeItem("selectedTags");
      localStorage.removeItem("featuredImage");
      localStorage.removeItem("imagePreview");

      // پاک کردن stateهای مرتبط با بلاگ (ریست کردن فرم)
      setTitle("");              // پاک کردن عنوان
      setMarkdown("");          // پاک کردن محتوا
      setSelectedTags([]);      // پاک کردن تگ‌های انتخاب‌شده
      setFeaturedImage(null);   // پاک کردن تصویر شاخص
      setImagePreview(null);    // پاک کردن پیش‌نمایش تصویر
    }
  } catch (err) {
    // در صورت بروز خطا در عملیات fetch، آن را در کنسول چاپ کن
    console.log(err);
  }
};

const fetchAuthorBlogs = async (page = 1) => {
  try {
    // ارسال درخواست GET به API بدون نیاز به هدر cookie
    const response = await fetch(
      `/api/author/blog?page=${page}`,
      {
        method: "GET",
        next: { revalidate: 1 }, // برای ISR در صورت استفاده
      }
    );

    const data = await response.json();
    console.log("📦 پاسخ دریافتی از API =>", data);
    // بررسی وضعیت موفقیت پاسخ
    if (!response.ok) {
      toast.error(data?.err || "خطا در دریافت بلاگ‌ها");
    } else {
      // بروزرسانی stateها با داده‌های دریافتی
      setBlogs(data.blogs);
      setPage(data.page);
      setTotalPages(data.totalPages);
    }
  } catch (err) {
    console.log("خطا در fetchAuthorBlogs:", err);
  }
};


const getUpdatingBlog = async (slug) => {
  try {
    const response = await fetch(`/api/blog/${slug}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data?.err);
    } else {
      setId(data?._id);                       // ذخیره id
      setTitle(data?.title);                 // عنوان
      setMarkdown(data?.content);            // محتوای markdown
      setSelectedTags(data?.tags);           // تگ‌ها
      setFeaturedImage(data?.featuredImage); // تصویر شاخص
      setImagePreview(data?.featuredImage);  // پیش‌نمایش تصویر
    }
  } catch (err) {
    console.log(err);
  }
};


const blogUpdate = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`/api/author/blog/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        content: markdown,
        tags: selectedTags?.map((tag) => tag._id),
        featuredImage,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data?.err);
    } else {
      toast.success("بلاگ با موفقیت ویرایش شد");
      // پاک‌سازی stateها
      setTitle("");
      setMarkdown("");
      setSelectedTags([]);
      setFeaturedImage(null);
      setImagePreview(null);
      setStep(1);
    }
  } catch (err) {
    console.log(err);
  }
};



// تابع حذف بلاگ با استفاده از fetch به API
const blogDelete = async (blogId) => {
  // گرفتن تأیید کاربر برای حذف
  const userConfirmed = window.confirm("آیا از حذف بلاگ مطمئن هستید؟");

  // اگر کاربر تأیید کرد، ادامه بده
  if (userConfirmed) {
    try {
      // ارسال درخواست DELETE به API
      const response = await fetch(`/api/author/blog/${blogId}`, {
        method: "DELETE",
      });

      // سعی کن بدنه پاسخ را به JSON تبدیل کنی
      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        // اگر خطا داشت (مثلاً پاسخ خالی بود)، مشکلی نیست
      }

      // اگر وضعیت پاسخ موفق نبود، پیام خطا نمایش بده
      if (!response.ok) {
        toast.error(data?.err || "خطا در حذف بلاگ");
      } else {
        toast.success("بلاگ با موفقیت حذف شد");

        // حذف بلاگ از لیست بلاگ‌ها در state
        const updatedBlogs = blogs.filter((blog) => blog._id !== blogId);
        setBlogs(updatedBlogs);

        // بازگشت به مرحله اول از فرم چندمرحله‌ای (اختیاری)
        setStep(1);
      }
    } catch (err) {
      // در صورت بروز خطای شبکه یا سرور
      console.error("خطا در حذف بلاگ:", err);
      toast.error("خطای شبکه یا سرور");
    }
  }
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
        step,
        setStep,
        handleNextStep,
        handlePrevStep,
        current,
        blogs,
        page,
        totalPages,
        fetchAuthorBlogs,
        getUpdatingBlog,
        blogUpdate,
        blogDelete,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

// هوک سفارشی برای استفاده آسان‌تر از BlogContext
export const useBlog = () => useContext(BlogContext);












