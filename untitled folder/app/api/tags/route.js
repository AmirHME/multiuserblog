// فایل: /app/api/tags/route.js

// ایمپورت ابزار پاسخ‌دهی از next/server
import { NextResponse } from "next/server";

// ایمپورت مدل تگ (برای خواندن از MongoDB)
import Tag from "@/models/tag";

// ایمپورت تابع اتصال به دیتابیس
import dbConnect from "@/utils/dbConnect";

// تابع GET برای گرفتن لیست تگ‌ها
export async function GET(req) {
  await dbConnect(); // اتصال به دیتابیس

  try {
    // گرفتن همه‌ی تگ‌ها و مرتب‌سازی بر اساس زمان ساخت (جدیدترها بالا)
    const tags = await Tag.find({}).sort({ createdAt: -1 });

    // برگرداندن لیست به صورت JSON
    return NextResponse.json(tags);
  } catch (err) {
    // اگر خطایی رخ داد، ارسال پیام خطا و کد وضعیت 500
    return NextResponse.json(
      { err: err.message },
      { status: 500 }
    );
  }
}