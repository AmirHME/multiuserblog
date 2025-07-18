"use client"; 
// مشخص می‌کند این کامپوننت فقط در سمت کلاینت باید اجرا شود (ویژه App Router در Next.js)

import { useEffect } from "react"; 
// ایمپورت هوک useEffect برای اجرای کد هنگام mount شدن کامپوننت

import { useBlog } from "@/context/blog"; 
// گرفتن state و توابع مرتبط با بلاگ از Context سراسری

import toast from "react-hot-toast"; 
// برای نمایش پیام‌های هشدار و موفقیت

import { useSession } from "next-auth/react"; 
// برای گرفتن اطلاعات session کاربر لاگین‌شده

export default function TagList() {
  // گرفتن داده‌ها و توابع لازم از context بلاگ
  const {
    tags,               // لیست تمام تگ‌ها
    tagList,            // تابع برای گرفتن لیست تگ‌ها از سرور
    searchTerm,         // عبارت جستجو برای فیلتر تگ‌ها
    selectedTags,       // تگ‌هایی که کاربر انتخاب کرده
    setSelectedTags,    // تابع تنظیم تگ‌های انتخاب‌شده
    tagDelete,          // تابع حذف تگ از سرور
  } = useBlog();

  const { data } = useSession(); 
  // گرفتن اطلاعات session کاربر فعلی (شامل id و role)

  // زمانی که کامپوننت mount شد، لیست تگ‌ها از سرور گرفته شود
  useEffect(() => {
    tagList(); // فراخوانی تابع گرفتن تگ‌ها
  }, []);

  // زمانی که کامپوننت mount شد، تگ‌های ذخیره‌شده در localStorage بازیابی شود
  useEffect(() => {
    const storedTags = JSON.parse(localStorage.getItem("selectedTags")) || []; 
    // اگر چیزی در localStorage ذخیره شده بود، بخونش، وگرنه آرایه خالی برگردون

    setSelectedTags(storedTags); // مقداردهی اولیه selectedTags از localStorage
  }, []);

  // تابع انتخاب تگ توسط کاربر
  const handleTagSelect = (tag) => {
    // بررسی اینکه تگ قبلاً انتخاب نشده باشد
    if (selectedTags.some((selectedTag) => selectedTag._id === tag._id)) {
      toast.error("این تگ قبلا انتخاب شده است."); // پیام هشدار
      return;
    }

    // بررسی اینکه بیشتر از ۵ تگ انتخاب نشود
    if (selectedTags.length >= 5) {
      toast.error("حداکثر میتوانید پنج تگ انتخاب کنید");
      return;
    }

    // افزودن تگ به ابتدای لیست
    const updatedTags = [tag, ...selectedTags];
    setSelectedTags(updatedTags); // به‌روزرسانی state

    // ذخیره تگ‌های جدید در localStorage
    localStorage.setItem("selectedTags", JSON.stringify(updatedTags));
  };

  // تابع حذف تگ از لیست انتخاب‌شده‌ها
  const handleTagRemove = (tagToRemove) => {
    // فیلتر کردن تگ‌هایی که نباید حذف شوند
    const updatedTags = selectedTags.filter(
      (tag) => tag._id !== tagToRemove._id
    );

    setSelectedTags(updatedTags); // به‌روزرسانی state

    // ذخیره لیست جدید در localStorage
    localStorage.setItem("selectedTags", JSON.stringify(updatedTags));
  };

  return (
    <div>
      {/* بخش نمایش تگ‌های انتخاب‌شده */}
      <div className="row d-flex justify-content-center align-items-center">
        {/* اگر تگی انتخاب شده باشد، یک عنوان نمایشی نشان بده */}
        {selectedTags?.length > 0 && (
          <p className="text-secondary m-1">تگ‌های انتخاب‌شده</p>
        )}

        {/* لیست تگ‌های انتخاب‌شده به صورت دکمه‌هایی با رنگ سبز */}
        <div
          className="d-flex align-items-center custom-scrollbar my-5"
          style={{ maxHeight: "280px", overflow: "auto" }}
        >
          {selectedTags?.map((tag) => (
            <div key={tag._id}>
              <button
                className="btn btn-lg btn-outline-success m-1"
                onClick={() => handleTagRemove(tag)} // کلیک روی دکمه باعث حذف تگ شود
              >
                {tag?.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* پیام راهنما برای انتخاب تگ */}
      <p className="text-secondary m-1">برای انتخاب تگ کلیک کنید</p>

      {/* نمایش تگ‌های موجود برای انتخاب */}
      <div
        className="col custom-scrollbar"
        style={{ maxHeight: "280px", overflow: "auto" }}
      >
        {tags
          ?.filter((t) =>
            t?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
          ) // فیلتر کردن تگ‌ها براساس عبارت جستجو
          .map((tag) => (
            <span key={tag._id}>
              {/* دکمه نمایش تگ برای انتخاب */}
              <button
                className="btn btn-lg btn-outline-secondary m-1"
                onClick={() => handleTagSelect(tag)}
              >
                {tag?.name}
              </button>

              {/* دکمه ضربدر برای حذف تگ، فقط اگر کاربر سازنده تگ باشد */}
              {tag?.postedBy?.toString() === data?.user?.id && (
                <button
                  onClick={() => {
                    console.log("🧨 دکمه حذف کلیک شد. ID:", tag._id);
                    tagDelete(tag._id); // فراخوانی تابع حذف تگ از سرور
                  }}
                  className="btn btn-lg btn-outline-danger me-4"
                >
                  X
                </button>
              )}
            </span>
          ))}
      </div>
    </div>
  );
}