// فایل: app/api/crud/tag/route.js

// وارد کردن تابع برای تولید پاسخ در API
import { NextResponse } from "next/server";

// وارد کردن مدل Tag برای کار با دیتابیس MongoDB
import Tag from "@/models/tag";

// ایمپورت تابع اتصال به دیتابیس MongoDB
import dbConnect from "@/utils/dbConnect";

// نصب‌شده با: npm i slugify → برای تولید slug از name
import slugify from "slugify";

// تعریف تابع POST برای ساخت تگ جدید
export async function POST(req) {
  await dbConnect(); // اتصال به دیتابیس

  // استخراج name از بدنه درخواست (JSON)
  const { name } = await req.json();

  try {
    // ساخت تگ جدید در دیتابیس با name و slug ساخته‌شده از name
    const tag = await Tag.create({ name, slug: slugify(name) });

    // برگرداندن پاسخ موفقیت‌آمیز با داده تگ
    return NextResponse.json(tag);
  } catch (err) {
    // در صورت خطا (مثلاً تگ تکراری)، پاسخ با وضعیت 500 و پیام خطا برمی‌گردد
    return NextResponse.json(
      { err: err.message },
      { status: 500 }
    );
  }
}