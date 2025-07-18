// فایل app/api/crud/uploads/route.js

import {
  NextResponse
} from "next/server";
import dbConnect from "@/utils/dbConnect"; // اتصال به دیتابیس (در صورت نیاز)
import cloudinary from "cloudinary";

// پیکربندی اتصال به Cloudinary با استفاده از متغیرهای محیطی
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// متد POST برای دریافت تصویر و ارسال به Cloudinary
export async function POST(req) {
  const {
    image
  } = await req.json(); // دریافت تصویر Base64 از کلاینت
  await dbConnect(); // اتصال به دیتابیس (در صورت نیاز)

  try {
    const result = await cloudinary.uploader.upload(image); // آپلود تصویر
    return NextResponse.json({
      url: result.secure_url
    }); // بازگرداندن آدرس تصویر
  } catch (err) {
    return NextResponse.json({
      err: err.message
    }, {
      status: 500
    });
  }
}