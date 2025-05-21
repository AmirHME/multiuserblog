import mongoose from "mongoose"; // وارد کردن ماژول مانگوس برای ارتباط با پایگاه داده MongoDB
import uniqueValidator from "mongoose-unique-validator"; // افزونه بررسی یکتایی برای جلوگیری از ثبت مقادیر تکراری

// تعریف اسکیمای کاربر (User Schema)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, // نوع داده: رشته
      required: [true, "نام الزامی است"], // فیلد اجباری با پیام خطای سفارشی
      trim: true, // حذف فاصله‌های اضافی ابتدا و انتهای مقدار
      minlength: [2, "نام باید حداقل 2 کاراکتر باشد"] // حداقل طول نام: ۲ کاراکتر
    },
    email: {
      type: String, // نوع داده: رشته
      required: [true, "ایمیل الزامی است"], // فیلد اجباری
      unique: true, // باید یکتا باشد (تکراری نباشد)
      lowercase: true, // تبدیل به حروف کوچک
      trim: true, // حذف فاصله‌های اضافی
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
        "لطفاً یک ایمیل معتبر وارد کنید"
      ] // بررسی فرمت ایمیل با استفاده از regex
    },
    password: {
      type: String, // نوع داده: رشته
      required: function() {
        return this.provider === "credentials"; // فقط اگر روش ورود "credentials" بود، رمز عبور اجباری است
      },
      minlength: [6, "رمز عبور باید حداقل 6 کاراکتر باشد"] // حداقل طول رمز عبور: ۶ کاراکتر
    },
    provider: {
      type: String, // نوع داده: رشته
      enum: ["credentials", "google"], // فقط یکی از این دو مقدار مجاز است
      default: "credentials" // مقدار پیش‌فرض: "credentials"
    },
    googleId: {
      type: String, // نوع داده: رشته
      unique: true, // باید یکتا باشد
      sparse: true // بررسی یکتایی فقط زمانی که مقدار وجود دارد
    },
    role: {
      type: [String], // نوع داده: آرایه‌ای از رشته‌ها
      default: ["subscriber"], // مقدار پیش‌فرض: "subscriber"
      enum: ["subscriber", "admin"] // فقط این دو مقدار مجاز هستند
    },
    image: String, // آدرس تصویر پروفایل کاربر (اختیاری)

    resetCode: {
      data: String, // کد بازیابی رمز عبور
      expiresAt: {
        type: Date, // زمان انقضای کد
        default: () => new Date(Date.now() + 10 * 60 * 1000) // پیش‌فرض: ۱۰ دقیقه بعد از زمان فعلی
      }
    }
  },
  {
    timestamps: true, // به‌صورت خودکار createdAt و updatedAt اضافه می‌کند
    toJSON: { virtuals: true }, // فعال‌سازی فیلدهای مجازی هنگام تبدیل به JSON
    toObject: { virtuals: true } // فعال‌سازی فیلدهای مجازی هنگام تبدیل به شیء معمولی
  }
);

// فعال‌سازی پلاگین یکتایی با پیام خطای سفارشی
userSchema.plugin(uniqueValidator, { message: "{PATH} قبلاً استفاده شده است." });

// اگر مدل قبلاً تعریف نشده بود، تعریفش کن؛ در غیر این صورت همان مدل موجود را استفاده کن
const User = mongoose.models.User || mongoose.model("User", userSchema);

// صادر کردن مدل برای استفاده در بقیه فایل‌ها
export default User;
