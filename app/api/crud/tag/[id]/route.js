// فایل: app/api/crud/tag/[id]/route.js

import { NextResponse } from "next/server"; // برای ساخت پاسخ HTTP
import Tag from "@/models/tag"; // مدل تگ
import Blog from "@/models/blog"; // مدل بلاگ برای بررسی استفاده از تگ
import dbConnect from "@/utils/dbConnect"; // اتصال به دیتابیس
// import { getServerSession } from "next-auth/next"; // گرفتن session
// import { authOptions } from "@/utils/authOptions"; // تنظیمات احراز هویت
import { createExcerpt , currentUser} from "@/utils/helpers";

export async function DELETE(req, context) {
  await dbConnect(); // اتصال به دیتابیس

  const user = await currentUser();

  // const session = await getServerSession(authOptions); // گرفتن session

  try {
    const tag = await Tag.findById(context.params.id); // پیدا کردن تگ

    // بررسی اینکه آیا کاربر مجاز به حذف هست یا نه
    const isOwner = tag.postedBy.toString() === user.id.toString();
    const isAdmin = user.role === "admin";

    if (isOwner || isAdmin) {
      // بررسی اینکه آیا این تگ در بلاگی استفاده شده؟
      const blogsWithThisTag = await Blog.find({ tags: context.params.id });

      if (blogsWithThisTag.length === 0) {
        // اگر هیچ بلاگی از این تگ استفاده نکرده، اجازه حذف داریم
        const deletedTag = await Tag.findByIdAndDelete(context.params.id);
        return NextResponse.json(deletedTag);
      } else {
        // اگر تگ در بلاگ‌ها استفاده شده بود، خطای مناسب برگردان
        return NextResponse.json(
          {
            err: "این تگ در یک یا چند بلاگ استفاده شده و قابل حذف نیست.",
          },
          { status: 403 }
        );
      }
    } else {
      // کاربر مجاز به حذف این تگ نیست
      return NextResponse.json(
        { err: "شما اجازه حذف این تگ را ندارید." },
        { status: 403 }
      );
    }
  } catch (err) {
    // خطای سرور
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}







