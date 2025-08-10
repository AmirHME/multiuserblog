// ایمپورت کلاس NextResponse برای بازگرداندن پاسخ HTTP از API
import { NextResponse } from "next/server";

// ایمپورت مدل بلاگ برای دسترسی به داده‌های بلاگ از دیتابیس
import Blog from "@/models/blog";

// ایمپورت تابع اتصال به دیتابیس
import dbConnect from "@/utils/dbConnect";

// تابع GET برای واکشی بلاگ خاص بر اساس slug
export async function GET(req, contextPromise) {
  // اتصال به دیتابیس MongoDB
  await dbConnect();

  try {
    // گرفتن پارامترهای داینامیک از context (در نسخه جدید Next.js باید با await انجام شود)
    const { params } = await contextPromise;

    // استخراج مقدار slug از پارامترها
    const slug = params.slug;

    // پیدا کردن بلاگ در دیتابیس بر اساس slug و پر کردن اطلاعات تگ‌ها و نویسنده
    const blog = await Blog.findOne({ slug })
      .populate("postedBy", "name") // فقط نام نویسنده را بیاور
      .populate("tags", "name");    // فقط نام تگ‌ها را بیاور

    // بازگرداندن نتیجه به صورت JSON
    return NextResponse.json(blog);
  } catch (err) {
    // در صورت بروز خطا، ارسال پیام خطا به همراه وضعیت 500
    return NextResponse.json(
      { err: err.message },
      { status: 500 }
    );
  }
}
