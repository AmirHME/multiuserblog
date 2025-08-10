// ایمپورت NextResponse برای ارسال پاسخ HTTP در Next.js
import { NextResponse } from "next/server";

// ایمپورت تابع اتصال به دیتابیس MongoDB
import dbConnect from "@/utils/dbConnect";

// ایمپورت مدل Tag برای کار با کالکشن تگ‌ها
import Tag from "@/models/tag";

// ایمپورت مدل Blog برای کار با کالکشن بلاگ‌ها
import Blog from "@/models/blog";

// تعریف تابع GET برای هندل کردن درخواست GET به این API
export async function GET(req, context) {
  // اتصال به دیتابیس
  await dbConnect();

  // گرفتن slug از پارامترهای آدرس (مثل /api/tag/web-development)
  const slug = context.params.slug;

  // گرفتن شماره صفحه از query string (مثل ?page=2) و اگر نبود، پیش‌فرض 1
  const page = req.nextUrl.searchParams.get("page") || 1;

  // تعیین تعداد بلاگ‌هایی که در هر صفحه نمایش داده می‌شوند
  const pageSize = 6;

  try {
    // پیدا کردن تگ موردنظر بر اساس slug
    const tag = await Tag.findOne({ slug });

    // محاسبه تعداد بلاگ‌هایی که باید رد شوند (برای pagination)
    const skip = (page - 1) * pageSize;

    // شمارش کل بلاگ‌هایی که این تگ را دارند
    const totalBlogs = await Blog.countDocuments({ tags: tag._id });

    // پیدا کردن بلاگ‌ها بر اساس تگ
    const blogs = await Blog.find({ tags: tag._id })
      // حذف فیلد content از نتایج
      .select("-content")
      // گرفتن اطلاعات نویسنده (فقط name)
      .populate("postedBy", "name")
      // گرفتن اطلاعات تگ‌ها (فقط name و slug)
      .populate("tags", "name slug")
      // رد کردن بلاگ‌های صفحه‌های قبلی
      .skip(skip)
      // محدود کردن تعداد نتایج به pageSize
      .limit(pageSize)
      // مرتب‌سازی بر اساس تاریخ ایجاد (جدیدترین اول)
      .sort({ createdAt: "-1" });

    // ارسال پاسخ JSON شامل بلاگ‌ها، صفحه فعلی، تعداد کل صفحات و خود تگ
    return NextResponse.json(
      {
        blogs,
        page,
        totalPages: Math.ceil(totalBlogs / pageSize),
        tag,
      },
      { status: 200 }
    );

  } catch (err) {
    // اگر خطایی رخ داد، چاپ خطا در کنسول
    console.log(err);

    // ارسال پاسخ خطا به کاربر
    return NextResponse.json(
      {
        err: "Server error. Please try again.",
      },
      { status: 500 }
    );
  }
}