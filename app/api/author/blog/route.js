// ایمپورت ابزار پاسخ‌دهی در API از نکست‌جی‌اس
import { NextResponse } from "next/server";

// ایمپورت مدل بلاگ برای ارتباط با دیتابیس
import Blog from "@/models/blog";

// ایمپورت تابع اتصال به دیتابیس مونگو
import dbConnect from "@/utils/dbConnect";

// ایمپورت تابعی که کاربر لاگین‌شده رو تشخیص می‌ده
import { currentUser } from "@/utils/helpers";

// تعریف تابع اصلی GET برای هندل کردن درخواست‌های GET به این API
export async function GET(req) {
  // اتصال به دیتابیس
  await dbConnect();

  // گرفتن شماره صفحه از query string؛ اگر نباشه مقدار پیش‌فرض ۱ در نظر گرفته می‌شه
  const page = req.nextUrl.searchParams.get("page") || 1;

  // تعیین تعداد بلاگ‌هایی که در هر صفحه نمایش داده می‌شن
  const pageSize = 6;

  // گرفتن اطلاعات کاربر لاگین‌شده با استفاده از توکن سشن
  const user = await currentUser();

  try {
    // محاسبه تعداد آیتم‌هایی که باید skip بشن بر اساس شماره صفحه
    const skip = (page - 1) * pageSize;

    // محاسبه کل تعداد بلاگ‌هایی که این کاربر نوشته
    const totalBlogs = await Blog.countDocuments({ postedBy: user.id });

    // گرفتن لیست بلاگ‌ها با شرایط زیر:
    const blogs = await Blog.find({ postedBy: user.id }) // فقط بلاگ‌هایی که توسط این کاربر نوشته شده
      .select("-content") // محتوای کامل بلاگ رو حذف می‌کنیم (برای بهینه‌سازی)
      .populate("postedBy", "name") // پر کردن اطلاعات نویسنده فقط با فیلد name
      .populate("tags", "name slug") // پر کردن اطلاعات تگ‌ها با name و slug
      .skip(skip) // رد کردن بلاگ‌های قبلی برای صفحه‌بندی
      .limit(pageSize) // محدود کردن تعداد بلاگ‌ها به اندازه pageSize
      .sort({ createdAt: "-1" }); // مرتب‌سازی بر اساس زمان ایجاد (جدیدترین در اول)

    // ارسال پاسخ موفق به فرانت‌اند همراه با داده‌های بلاگ و اطلاعات صفحه‌بندی
    return NextResponse.json(
      {
        blogs, // آرایه بلاگ‌ها
        page, // شماره صفحه فعلی
        totalPages: Math.ceil(totalBlogs / pageSize), // تعداد کل صفحات
      },
      { status: 200 } // وضعیت موفق
    );
  } catch (err) {
    // در صورت بروز خطا، چاپ آن در کنسول برای دیباگ
    console.log(err);

    // ارسال پیام خطا به فرانت‌اند
    return NextResponse.json(
      {
        err: err.message, // ارسال پیام خطا
      },
      { status: 500 } // وضعیت سرور خطا
    );
  }
}