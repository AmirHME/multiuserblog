// 1. نصب پکیج mongoose-unique-validator (اجرا در ترمینال):

// npm i mongoose-unique-validator

/**
 * مدل کاربر
 * این فایل شامل اسکیما و مدل کاربر برای MongoDB است
 */


// ایمپورت ماژول‌های مورد نیاز
import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

/**
 * تعریف اسکیمای کاربر
 * شامل فیلدهای مورد نیاز برای ذخیره اطلاعات کاربر
 */
const userSchema = new mongoose.Schema(
  {
    
// نام کاربر
    name: {
      type: String,
      required: [true, "نام الزامی است"],
      trim: true,
      minlength: [2, "نام باید حداقل 2 کاراکتر باشد"]
    },
    
    
// ایمیل کاربر - باید یکتا باشد
    email: {
      type: String,
      required: [true, "ایمیل الزامی است"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "لطفاً یک ایمیل معتبر وارد کنید"]
    },
    
    
// رمز عبور کاربر
    password: {
      type: String,
      required: [true, "رمز عبور الزامی است"],
      minlength: [6, "رمز عبور باید حداقل 6 کاراکتر باشد"]
    },
    
    
// نقش کاربر (مشترک یا ادمین)
    role: {
      type: [String],
      default: ["subscriber"],
      enum: ["subscriber", "admin"]
    },
    
    
// آدرس تصویر پروفایل
    image: String,
    
    
// کد بازیابی رمز عبور
    resetCode: {
      data: String,
      
// تاریخ انقضای کد (10 دقیقه)
      expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000)
      }
    }
  },
  { 
    
// اضافه کردن timestamps (createdAt و updatedAt)
    timestamps: true,
    
// فعال کردن virtuals
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


// اضافه کردن پلاگین اعتبارسنجی یکتا بودن
userSchema.plugin(uniqueValidator, { message: "{PATH} قبلاً استفاده شده است." });


// ایجاد مدل با تنظیمات بهینه
const User = mongoose.models.User || mongoose.model("User", userSchema);

// حذف ایجاد ایندکس اضافی که باعث خطا می‌شود
// User.createIndexes().catch(err => {
//   console.error("خطا در ایجاد ایندکس‌ها:", err);
// });


// اکسپورت مدل
export default User; 
