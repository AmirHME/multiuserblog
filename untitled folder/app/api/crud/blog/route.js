// فایل: app/api/crud/blog/route.js

import { NextResponse } from "next/server"; // برای ساخت پاسخ استاندارد API
import Blog from "@/models/blog"; // ایمپورت مدل بلاگ
import dbConnect from "@/utils/dbConnect"; // تابع اتصال به دیتابیس MongoDB
import slugify from "slugify"; // برای ساخت slug (نامک) از عنوان بلاگ
import User from "@/models/user"; // فراموش نکن مدل User رو هم ایمپورت کنی

// import { getServerSession } from "next-auth/next"; // گرفتن اطلاعات سشن از سرور
// import { authOptions } from "@/utils/authOptions"; // تنظیمات احراز هویت برای NextAuth
import { createExcerpt , currentUser} from "@/utils/helpers";

// متد POST برای ساخت بلاگ
export async function POST(req) {
  await dbConnect(); // اتصال به دیتابیس
  const user = await currentUser();
  // const session = await getServerSession(authOptions); // گرفتن اطلاعات سشن کاربر وارد شده
  const body = await req.json(); // خواندن داده‌های ارسالی در بدنه درخواست

  console.log("blog create => ", body); // چاپ اطلاعات دریافتی در کنسول

  try {
    // ساخت بلاگ جدید در دیتابیس
    const blog = await Blog.create({
      ...body, // اطلاعات بدنه مثل title، content، tags، image
      slug: slugify(body.title), // تولید slug از عنوان
      excerpt: createExcerpt(body.content), // تولید خلاصه از محتوای بلاگ
      // postedBy: session.user.id, // اضافه کردن نویسنده از اطلاعات سشن
      postedBy: user.id, // اضافه کردن نویسنده از اطلاعات سشن

    });

// بعد از دریافت اطلاعات کاربر لاگین‌شده (مثلاً از session یا token)
await User.findOneAndUpdate(
  { _id: user.id },
  { $addToSet: { role: "author" } } // اطمینان از اینکه نقش author فقط یکبار اضافه می‌شه
);


    // اگر موفق بود، بلاگ ایجاد شده را برگردان
    return NextResponse.json(blog);
  } catch (err) {
    // اگر خطا داشت، پاسخ با وضعیت 500 و پیام خطا
    return NextResponse.json(
      {
        err: err.message,
      },
      { status: 500 }
    );
  }
}