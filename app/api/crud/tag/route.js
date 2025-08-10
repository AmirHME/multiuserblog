// API مربوط به ساخت تگ جدید

// ایمپورت پاسخ‌دهی در API
import { NextResponse } from "next/server";

// ایمپورت مدل تگ
import Tag from "@/models/tag";

// اتصال به دیتابیس
import dbConnect from "@/utils/dbConnect";

// کتابخانه تبدیل name به slug
import slugify from "slugify";

// گرفتن session سمت سرور
import { getServerSession } from "next-auth/next";

// تنظیمات احراز هویت
import { authOptions } from "@/utils/authOptions";


import { createExcerpt , currentUser} from "@/utils/helpers";


import mongoose from "mongoose";

// متد POST برای ساخت تگ جدید
export async function POST(req) {
  await dbConnect(); // اتصال به دیتابیس

  const user = await currentUser();

  // const session = await getServerSession(authOptions); // گرفتن اطلاعات کاربر لاگین‌شده
  const { name } = await req.json(); // دریافت name از درخواست

  try {
    // ساخت تگ در دیتابیس با اطلاعات کامل
    const tag = await Tag.create({
      name,
      slug: slugify(name), // ساخت slug از name
      postedBy: user.id, // ذخیره آیدی کاربری که تگ را ساخته
    });

    // ارسال پاسخ موفقیت‌آمیز
    return NextResponse.json(tag);
  } catch (err) {
    // ارسال خطا در صورت شکست عملیات
    console.log("🛠 خطای حذف تگ:", err.message); // ← اینو اضافه کن
    return NextResponse.json({ err: err.message }, { status: 500 });  }
}

