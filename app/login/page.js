// npm i next-auth

// مسیر این فایل در ساختار پروژه که صفحه ورود را پیاده‌سازی می‌کند
// app/login/page

"use client";
// این دستور به Next.js اعلام می‌کند که این کامپوننت باید در سمت کلاینت (مرورگر) اجرا شود، نه سرور

import { useState } from "react";
// وارد کردن هوک useState برای مدیریت state در کامپوننت تابعی

import toast from "react-hot-toast";
// وارد کردن کتابخانه toast برای نمایش اعلان‌های پاپ‌آپ به کاربر

import { useRouter, useSearchParams } from "next/navigation";
// وارد کردن هوک‌های router و useSearchParams برای هدایت کاربر و دریافت پارامترهای URL

import { signIn } from "next-auth/react";
// وارد کردن تابع signIn از NextAuth برای مدیریت ورود کاربران

import Link from "next/link";
// وارد کردن کامپوننت Link برای ناوبری بدون بارگذاری مجدد کل صفحه

// کامپوننت اصلی صفحه ورود - تابعی که UI صفحه لاگین را تعریف و رندر می‌کند
export default function Login() {
  const [email, setEmail] = useState("");
  // state برای ذخیره ایمیل کاربر
  
  const [password, setPassword] = useState("");
  // state برای ذخیره رمز عبور کاربر
  
  const [loading, setLoading] = useState(false);
  // state برای مدیریت وضعیت بارگذاری (لودینگ)
  
  const router = useRouter();
  // دریافت router برای هدایت کاربر - دسترسی به API مسیریابی Next.js

  const searchParams = useSearchParams();
  // دریافت پارامترهای جستجو (برای گرفتن callbackUrl)
  
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  // دریافت callbackUrl از URL یا استفاده از صفحه اصلی به عنوان پیش‌فرض

  // تابع ارسال فرم - این تابع زمانی اجرا می‌شود که کاربر دکمه ورود را فشار می‌دهد
  const handleSubmit = async (e) => {
    e.preventDefault();
    // جلوگیری از رفتار پیش‌فرض فرم که باعث بارگذاری مجدد صفحه می‌شود
    
    setLoading(true);
    // شروع لودینگ - به روزرسانی state برای نمایش وضعیت بارگذاری به کاربر
    
    const result = await signIn("credentials", {
      redirect: false,
      // غیرفعال کردن ریدایرکت خودکار NextAuth
      
      email,
      // ارسال ایمیل کاربر به سیستم احراز هویت
      
      password,
      // ارسال رمز عبور کاربر به سیستم احراز هویت
    });
    // فراخوانی تابع signIn برای ورود کاربر با استفاده از روش credentials
    
    setLoading(false);
    // پایان لودینگ - به‌روزرسانی state لودینگ به false
    
    if (result.error) {
      toast.error(result.error);
      // نمایش خطا - نمایش پیام خطا با استفاده از toast.error اگر ورود ناموفق باشد
    } else {
      toast.success("ورود با موفقیت انجام شد");
      // نمایش پیام موفقیت - اعلان پاپ‌آپ سبز رنگ برای موفقیت در ورود
      
      router.push(callbackUrl);
      // هدایت به صفحه‌ای که کاربر قبلاً قصد داشته به آن دسترسی داشته باشد
      // اگر callbackUrl موجود نباشد، به صفحه اصلی هدایت می‌شود
    }
  };
  
  // رندر فرم ورود - بخش JSX که تمام عناصر UI صفحه را تعریف می‌کند
  return (
    <main>
      {/* تگ اصلی برای محتوای صفحه */}
      
      <div className="container">
        {/* کانتینر اصلی با استایل Bootstrap */}
        
        <div className="row d-flex justify-content-center align-items-center vh-90">
          {/* ردیفی که محتوا را در مرکز صفحه قرار می‌دهد */}
          
          <div className="col-lg-5 p-4 shadow">
            {/* ستونی با سایه و پدینگ */}
            
            <h2 className="mb-4 lead fw-bold">ورود</h2>
            {/* عنوان صفحه با استایل متن بولد */}
            
            <form onSubmit={handleSubmit}>
              {/* فرم که به رویداد onSubmit تابع handleSubmit را متصل می‌کند */}
              
              <input
                type="email"
                // نوع ورودی ایمیل که اعتبارسنجی اولیه فرمت ایمیل را فراهم می‌کند
                
                value={email}
                // مقدار فیلد از state email
                
                onChange={(e) => setEmail(e.target.value)}
                // به‌روزرسانی state با تغییر مقدار فیلد
                
                className="form-control p-3 mb-4"
                // استایل‌های Bootstrap با پدینگ و مارجین
                
                placeholder="ایمیل"
                // متن نمایشی قبل از ورود داده
              />
              
              <input
                type="password"
                // نوع ورودی رمز عبور که کاراکترها را مخفی می‌کند
                
                value={password}
                // مقدار فیلد از state password
                
                onChange={(e) => setPassword(e.target.value)}
                // به‌روزرسانی state با تغییر مقدار فیلد
                
                className="form-control p-3 mb-4"
                // استایل‌های Bootstrap با پدینگ و مارجین
                
                placeholder="رمز عبور"
                // متن نمایشی قبل از ورود داده
              />
              
              <button
                className="btn btn-lg btn-primary w-100"
                // استایل‌های Bootstrap برای دکمه بزرگ اصلی با عرض کامل
                
                disabled={loading || !email || !password}
                // غیرفعال می‌شود اگر در حال بارگذاری باشد یا هر یک از فیلدها خالی باشند
              >
                {loading ? "در حال ورود..." : "ورود"}
                {/* متن دکمه بسته به وضعیت لودینگ تغییر می‌کند */}
              </button>
            </form>
            
            <Link className="nav-link text-center" href="/forgot-password">
              {/* لینک به صفحه فراموشی رمز عبور با استایل مرکز متن */}
              
              فراموشی رمز عبور
              {/* متن لینک برای فراموشی رمز عبور */}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// بدون پیکربندی صحیح NextAuth، این صفحه به صفحه خطا هدایت خواهد شد


