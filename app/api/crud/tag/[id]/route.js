// فایل: app/api/crud/tag/[id]/route.js

// ایمپورت تابع پاسخ‌دهی از next/server برای ارسال پاسخ HTTP
import { NextResponse } from "next/server";

// ایمپورت مدل تگ از پوشه models برای کار با دیتابیس
import Tag from "@/models/tag";

// ایمپورت تابع اتصال به دیتابیس MongoDB
import dbConnect from "@/utils/dbConnect";

// ایمپورت گرفتن session از سمت سرور (با NextAuth)
import { getServerSession } from "next-auth/next";

// ایمپورت تنظیمات احراز هویت برای session
import { authOptions } from "@/utils/authOptions";

// تابع DELETE برای حذف یک تگ خاص با آیدی مشخص
export async function DELETE(req, context) {
  // اتصال به دیتابیس MongoDB
  await dbConnect();

  // گرفتن session کاربر لاگین‌شده (شامل اطلاعات احراز هویت)
  const session = await getServerSession(authOptions);

  try {
    // استخراج آیدی تگ از پارامتر آدرس (context.params.id)
    const tag = await Tag.findById(context.params.id);

    // بررسی مجوز کاربر برای حذف تگ
    if (
      tag.postedBy.toString() === session.user.id.toString() || // اگر خود کاربر سازنده تگ باشد
      session.user.role === "admin" // یا نقش کاربر "admin" باشد
    ) {
      // حذف تگ از دیتابیس
      const deletedTag = await Tag.findByIdAndDelete(context.params.id);

      // ارسال پاسخ موفقیت‌آمیز همراه با داده تگ حذف‌شده
      return NextResponse.json(deletedTag);
    } else {
      // اگر کاربر مجاز نیست، خطای 403 (مجاز نیست) برگردان
      return NextResponse.json(
        { err: "Unauthorized to delete this tag." },
        { status: 403 }
      );
    }
  } catch (err) {
    // در صورت بروز خطای پیش‌بینی‌نشده، پاسخ با وضعیت 500 (خطای سرور داخلی) ارسال می‌شود
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}