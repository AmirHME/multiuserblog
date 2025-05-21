import mongoose from 'mongoose';  
// وارد کردن کتابخانه‌ی mongoose برای ارتباط با دیتابیس MongoDB

const DB_URI = process.env.DB_URI;  
// گرفتن مقدار آدرس دیتابیس از متغیر محیطی تعریف‌شده در فایل .env.local

if (!DB_URI) {
  throw new Error('❌ لطفاً متغیر محیطی DB_URI را در فایل .env.local تعریف کنید');
}
// اگر آدرس دیتابیس تعریف نشده باشد، اجرای برنامه متوقف شده و خطا نمایش داده می‌شود

// تابعی برای اتصال به دیتابیس MongoDB تعریف می‌کنیم
async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    console.log('✅ MongoDB already connected');
    return;
  }
  // اگر اتصال قبلاً برقرار شده باشد، مجدد تلاش به اتصال انجام نمی‌شود

  try {
    console.log('🔌 Connecting to MongoDB...');
    // تلاش برای برقراری اتصال جدید به دیتابیس

    const options = {
      useNewUrlParser: true,             // استفاده از پارسر جدید برای آدرس دیتابیس
      useUnifiedTopology: true,          // استفاده از سیستم جدید مدیریت اتصال
      serverSelectionTimeoutMS: 10000,   // حداکثر زمان انتظار برای انتخاب سرور (بر حسب میلی‌ثانیه)
    };

    await mongoose.connect(DB_URI, options);
    // برقراری اتصال به MongoDB با استفاده از آدرس و تنظیمات داده‌شده

    console.log('✅ Connected to MongoDB successfully');
    // در صورت موفقیت‌آمیز بودن اتصال، پیام موفقیت در کنسول نمایش داده می‌شود

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // در صورت بروز خطا هنگام اتصال، پیام خطا در کنسول نمایش داده می‌شود

    throw error;
    // ارسال خطا به بخش فراخوانی کننده‌ی تابع برای مدیریت بهتر خطا
  }
}

export default dbConnect;
// صادر کردن تابع dbConnect برای استفاده در سایر فایل‌ها
