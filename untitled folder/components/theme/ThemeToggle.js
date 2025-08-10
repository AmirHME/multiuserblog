"use client";                                  // مشخص می‌کند این کامپوننت فقط در کلاینت (مرورگر) اجرا شود

import { useTheme } from "@/context/theme";   // وارد کردن هوک سفارشی useTheme برای دسترسی به تم و تابع تغییر تم
import { useEffect, useState } from "react";  // وارد کردن هوک‌های useEffect و useState از React برای مدیریت حالت و اثرات جانبی

export default function ThemeToggle() {       // تعریف کامپوننت ThemeToggle برای تغییر حالت تم
  const { theme, toggleTheme } = useTheme();  // گرفتن مقدار فعلی تم و تابع تغییر تم از Context

  // تعریف state به نام mounted برای بررسی اینکه کامپوننت روی کلاینت رندر شده یا خیر
  const [mounted, setMounted] = useState(false);

  // useEffect با آرایه وابستگی خالی به این معنی که فقط بعد از اولین رندر اجرا می‌شود
  useEffect(() => {
    setMounted(true);                         // پس از رندر اولیه، مقدار mounted را true می‌کند تا نشان دهد کامپوننت آماده نمایش است
  }, []);

  return (
    <>
      {mounted &&                             // فقط زمانی که mounted true است، دکمه نمایش داده می‌شود (برای جلوگیری از رندر سمت سرور)
        <button className="nav-link" onClick={toggleTheme}>  {/* دکمه با کلاس nav-link که با کلیک، تابع تغییر تم اجرا می‌شود */}
          {theme === 'light' ? "🌙" : "☀️"}  {/* اگر تم روشن است، آیکون ماه نمایش داده می‌شود وگرنه آیکون خورشید */}
        </button>
      }
    </>
  );
}

