"use client"; 
 // مشخص می‌کند که این فایل باید روی کلاینت اجرا شود (مهم در Next.js که SSR دارد)

import { createContext, useContext, useState, useEffect } from "react";  // وارد کردن توابع و هوک‌های React برای مدیریت Context و State

const ThemeContext = createContext();  // ایجاد یک Context جدید برای نگهداری وضعیت تم (روشن یا تاریک)

const getDefaultTheme = () => {  // تابع برای دریافت تم پیش‌فرض کاربر از localStorage یا مقدار پیش‌فرض "light"
  if (typeof window !== "undefined") {  // بررسی اینکه کد در مرورگر اجرا می‌شود نه سرور (برای جلوگیری از خطا)
    try {
      const savedTheme = localStorage.getItem("theme");  // دریافت تم ذخیره شده در localStorage
      return savedTheme || "light";  // اگر تم ذخیره شده نبود، "light" به عنوان پیش‌فرض برگردانده می‌شود
    } catch (error) {
      console.error("Error accessing localStorage:", error);  // اگر خطایی در دسترسی به localStorage رخ دهد، آن را لاگ می‌کند
      return "light";  // در صورت خطا، تم پیش‌فرض "light" انتخاب می‌شود
    }
  }
  return "light";  // اگر در محیط سرور اجرا شود، تم پیش‌فرض "light" برگردانده می‌شود
};

// کامپوننت Provider که تم و تابع تغییر تم را به کل کامپوننت‌های فرزند می‌دهد
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getDefaultTheme());  // تعریف State تم که مقدار اولیه آن با تابع getDefaultTheme تعیین می‌شود

  useEffect(() => {  // هوک اثر که هر زمان مقدار theme تغییر کند، این کد اجرا می‌شود
    try {
      document.documentElement.setAttribute("data-bs-theme", theme);  // تنظیم تم در تگ ریشه HTML (برای Bootstrap)
      document.body.setAttribute("data-bs-theme", theme);  // تنظیم تم در بدنه صفحه
      // تغییر کلاس بدنه برای تنظیم رنگ پس‌زمینه و رنگ متن بر اساس تم
      document.body.className = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
      localStorage.setItem("theme", theme);  // ذخیره تم انتخاب شده در localStorage برای حفظ انتخاب کاربر
    } catch (error) {
      console.error("Error setting theme:", error);  // اگر خطایی در تنظیم تم پیش بیاید، لاگ می‌کند
    }
  }, [theme]);  // وابسته به تغییر متغیر theme است

  // تابع تغییر تم که تم را بین "light" و "dark" جابجا می‌کند
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      return newTheme;
    });
  };

  // بازگشت کامپوننت Provider که تم و تابع تغییر تم را به Context می‌فرستد و children را رندر می‌کند
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// هوک سفارشی برای استفاده راحت‌تر از ThemeContext در کامپوننت‌ها
export const useTheme = () => {
  const context = useContext(ThemeContext);  // گرفتن مقدار Context
  if (context === undefined) {  // اگر این هوک خارج از Provider استفاده شود، خطا می‌دهد
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;  // مقدار context (تم و toggleTheme) را بازمی‌گرداند
};