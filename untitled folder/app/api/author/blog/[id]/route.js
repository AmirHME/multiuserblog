// ایمپورت کلاس NextResponse برای ساخت پاسخ API
import { NextResponse } from "next/server";

// ایمپورت مدل Blog برای ارتباط با دیتابیس MongoDB
import Blog from "@/models/blog";

// ایمپورت تابع اتصال به دیتابیس
import dbConnect from "@/utils/dbConnect";

// ایمپورت تابع currentUser برای گرفتن اطلاعات کاربر لاگین‌شده
import { currentUser } from "@/utils/helpers";

// ایمپورت slugify برای ساخت slug از عنوان بلاگ (مثلاً "سلام دنیا" → "salam-donya")
import slugify from "slugify";

// تعریف هندلر متد PUT برای بروزرسانی بلاگ
export async function PUT(req, context) {
  // اتصال به دیتابیس MongoDB
  await dbConnect();

  // گرفتن id بلاگ از پارامترهای آدرس URL
  const { id } = context.params;

  // گرفتن اطلاعات جدید بلاگ از بدنه درخواست
  const body = await req.json();

  // گرفتن اطلاعات کاربر فعلی از session
  const user = await currentUser();

  // چاپ نقش کاربر در لاگ برای دیباگ
  console.log("user.role => in blog update => ", user.role);

  // پیدا کردن بلاگ در دیتابیس با استفاده از id
  const blog = await Blog.findById(id);

  // بررسی اینکه آیا کاربر فعلی همان نویسنده بلاگ هست یا نه
  if (blog.postedBy.toString() !== user.id.toString()) {
    // اگر کاربر مجاز نباشد، خطای 401 برگردان
    return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
  }

  try {
    // اگر همه چیز درست بود، بروزرسانی بلاگ را انجام بده
    const updated = await Blog.updateOne(
      { _id: id }, // شرط فیلتر: id بلاگ
      {
        ...body,                 // بدنه جدید شامل title, content, tags و ...
        slug: slugify(body.title), // تولید slug جدید بر اساس عنوان
      },
      { new: true }             // گزینه برای دریافت مقدار جدید (در updateOne تأثیری ندارد اما برای هماهنگی حفظ شده)
    );

    // بازگرداندن نتیجه موفق با وضعیت 200
    return NextResponse.json(updated, { status: 200 });

  } catch (err) {
    // در صورت خطا، لاگ خطا و پاسخ با وضعیت 500
    console.error(err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}



// تعریف تابع حذف بلاگ در API با متد DELETE
export async function DELETE(req , context) {
    // اتصال به پایگاه داده
    await dbConnect();
  
    // استخراج id از آدرس URL
    const { id } = context.params;
  
    // گرفتن اطلاعات کاربر لاگین‌شده
    const user = await currentUser();
  
    // جستجوی بلاگ با id مشخص‌شده
    const blog = await Blog.findById(id);
  
    // اگر بلاگ پیدا نشد، پیام خطا برگردان
    if (!blog) {
      return NextResponse.json({ err: "Blog not found" }, { status: 404 });
    }
  
    // بررسی اینکه آیا بلاگ متعلق به همین کاربر است یا نه
    if (blog.postedBy.toString() !== user.id.toString()) {
      return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
    }
  
    // در صورت مجاز بودن، حذف بلاگ انجام شود
    try {
      const deleted = await Blog.deleteOne({ _id: id }); // حذف با آیدی
      return NextResponse.json(deleted); // بازگرداندن نتیجه حذف
    } catch (err) {
      console.log(err); // چاپ خطا برای دیباگ
      return NextResponse.json({ err: err.message }, { status: 500 }); // ارسال پیام خطا به کلاینت
    }
  }