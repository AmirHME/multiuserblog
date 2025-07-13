// فایل models/tag.js

// ایمپورت کتابخانه mongoose برای ارتباط با MongoDB
import mongoose from "mongoose";

// ایمپورت پلاگین برای بررسی یکتابودن مقادیر خاص در schema
import uniqueValidator from "mongoose-unique-validator";

// تعریف اسکیمای تگ با استفاده از mongoose.Schema
const tagSchema = new mongoose.Schema(
  {
    // فیلد name برای نام تگ
    name: {
      type: String,         // نوع داده: رشته‌ای
      required: true,       // این فیلد اجباری است
      unique: true,         // مقدار آن باید بین همه تگ‌ها یکتا باشد
      minLength: 1,         // حداقل طول 1 کاراکتر
      maxLength: 32,        // حداکثر طول 32 کاراکتر
    },

    // فیلد slug برای استفاده URL-friendly از نام تگ
    slug: {
      type: String,         // نوع داده: رشته‌ای
      required: true,       // این فیلد هم اجباری است
      unique: true,         // باید یکتا باشد
      index: true,          // روی این فیلد ایندکس ساخته شود (برای جستجو سریع‌تر)
      lowercase: true,      // تمام حروف آن به حروف کوچک تبدیل شود
    },
  },

  // تنظیمات اضافی: mongoose به‌صورت خودکار createdAt و updatedAt را ذخیره کند
  { timestamps: true }
);

// افزودن پلاگین بررسی یکتا بودن مقدار name و slug
tagSchema.plugin(uniqueValidator, { message: "is already taken." });
// در صورتی که مقدار تکراری وارد شود، پیام خطا نمایش داده می‌شود

// خروجی: اگر مدل "Tag" قبلاً ساخته شده باشد، همان را برگردان؛ در غیر این صورت مدل جدید بساز
export default mongoose.models.Tag || mongoose.model("Tag", tagSchema);