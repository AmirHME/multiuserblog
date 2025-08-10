// فایل: app/api/blogs/route.js

import { NextResponse } from "next/server"; 
// برای بازگشت پاسخ HTTP از API

import Blog from "@/models/blog"; 
// مدل Mongoose بلاگ برای کار با پایگاه‌داده MongoDB

import Tag from "@/models/tag";

import dbConnect from "@/utils/dbConnect"; 
// تابع اتصال به دیتابیس MongoDB


// تابع GET برای گرفتن لیست بلاگ‌ها به صورت صفحه‌بندی‌شده
export async function GET(req) {
  await dbConnect(); 
  // اتصال به دیتابیس برقرار می‌شود

  // گرفتن شماره صفحه از پارامتر URL (مثل ?page=2)، اگر نبود مقدار پیش‌فرض 1
  const page = req.nextUrl.searchParams.get("page") || 1;

  // تعداد بلاگ‌هایی که در هر صفحه باید نمایش داده شوند
  const pageSize = 6;

  try {
    // محاسبه تعداد بلاگ‌هایی که باید از ابتدا رد کنیم
    const skip = (page - 1) * pageSize;

    // محاسبه تعداد کل بلاگ‌های موجود در دیتابیس
    const totalBlogs = await Blog.countDocuments({});

    // واکشی بلاگ‌ها از دیتابیس:
    const blogs = await Blog.find({})
      .select("-content")
      .populate("postedBy", "name") // گرفتن فقط نام نویسنده
      .populate("tags", "name slug") // گرفتن فقط نام و اسلاگ تگ‌ها
      .skip(skip) // رد کردن بلاگ‌های قبلی برای رسیدن به این صفحه
      .limit(pageSize) // محدود کردن تعداد بلاگ‌ها به ۶ عدد
      .sort({ createdAt: "-1" }); // مرتب‌سازی نزولی بر اساس زمان ایجاد

    console.log(blogs.length, " blogs"); 
    // نمایش تعداد بلاگ‌های دریافت‌شده در لاگ

    return NextResponse.json(
      {
        blogs, // آرایه بلاگ‌های فعلی
        page, // شماره صفحه فعلی
        totalPages: Math.ceil(totalBlogs / pageSize), // محاسبه تعداد کل صفحات
      },
      { status: 200 } // کد وضعیت موفق
    );
  } catch (err) {
    console.log(err); // نمایش خطا در کنسول

    return NextResponse.json(
      {
        err: err.message, // بازگرداندن پیام خطا به کلاینت
      },
      { status: 500 } // وضعیت خطای داخلی سرور
    );
  }
}






