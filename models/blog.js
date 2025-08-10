// models/blog.js

import mongoose from "mongoose"; // ایمپورت ماژول mongoose برای ساخت مدل
import uniqueValidator from "mongoose-unique-validator"; // افزونه‌ای برای بررسی یکتایی فیلدها (مثلاً title و slug)
// تعریف اسکیمای بلاگ
const blogSchema = new mongoose.Schema(
  {
    // عنوان بلاگ (باید یکتا باشد و بین 1 تا 160 کاراکتر)
    title: {
      type: String,
      required: true,
      unique: true,
      minLength: 1,
      maxLength: 160,
    },

    // slug یا نامک بلاگ (در URL استفاده می‌شود، باید یکتا باشد)
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true, // برای جستجوی سریع‌تر در دیتابیس
      lowercase: true, // تبدیل خودکار به حروف کوچک
    },

    // محتوای اصلی بلاگ (markdown تبدیل شده به HTML)
    content: {
      type: String,
      required: true,
      minLength: 160, // حداقل ۱۶۰ کاراکتر
      maxLength: 20000, // حداکثر ۲۰۰۰۰ کاراکتر
    },

    // آرایه‌ای از تگ‌ها (هر تگ شناسه‌ای از مدل Tag است)
    tags: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tag", // ارتباط با مدل Tag
      },
    ],

    // آدرس تصویر شاخص بلاگ
    featuredImage: String,

    // نویسنده بلاگ (شناسه کاربر از مدل User)
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // ارتباط با مدل User
      required: true, // اجباری است
    },

    // آیا بلاگ منتشر شده یا نه (پیش‌فرض منتشر شده)
    published: {
      type: Boolean,
      default: true,
    },
    excerpt: {
      type: String,
      maxLength: 320,
    },
  },
  {
    timestamps: true, // افزودن createdAt و updatedAt به‌صورت خودکار
  }
);

// اضافه کردن پلاگین بررسی یکتایی برای title و slug
blogSchema.plugin(uniqueValidator, {
  message: "is already taken.", // پیام خطای اختصاصی
});

// اگر مدل Blog قبلاً ساخته نشده باشد، بساز؛ در غیر این صورت همان را استفاده کن (برای جلوگیری از خطای Hot Reload در Next.js)
export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);