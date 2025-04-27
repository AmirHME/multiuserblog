/**
 * فایل dbConnect.js
 *
 * این فایل مسئول اتصال به دیتابیس MongoDB است
 * شامل توضیحات کامل خط به خط کد
 */

// ایمپورت کتابخانه mongoose برای کار با MongoDB
import mongoose from 'mongoose';

/**
 * تابع اتصال به دیتابیس
 * @returns {Promise<void>}
 */
const dbConnect = async () => {
  try {
    
    // بررسی وضعیت اتصال فعلی
    if (mongoose.connection.readyState >= 1) {
      console.log('Already connected to MongoDB');
      return;
    }

    // تعریف تنظیمات اتصال به دیتابیس
    const options = {
      // زمان انتظار برای انتخاب سرور (50 ثانیه)
      serverSelectionTimeoutMS: 10000,

      // زمان انتظار برای سوکت (45 ثانیه)
      socketTimeoutMS: 45000,

      // زمان انتظار برای اتصال اولیه (30 ثانیه)
      connectTimeoutMS: 30000,

      // حداکثر تعداد اتصالات همزمان
      maxPoolSize: 50,

      // حداقل تعداد اتصالات همزمان
      minPoolSize: 10,

      // فرکانس بررسی وضعیت سرور (10 ثانیه)
      heartbeatFrequencyMS: 10000,

      // حالت مانیتورینگ سرور
      serverMonitoringMode: 'stream',

      // فعال کردن نوشتن مجدد در صورت خطا
      retryWrites: true,

      // سطح تایید نوشتن (اکثریت)
      w: 'majority',
    };

    // اتصال به دیتابیس با استفاده از آدرس و تنظیمات
    // process.env.DB_URI آدرس دیتابیس از فایل .env
    await mongoose.connect(process.env.DB_URI, options);

    // نمایش پیام موفقیت
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    // نمایش خطا در صورت عدم موفقیت
    console.error('Error connecting to MongoDB:', error);

    // پرتاب خطا برای مدیریت در سطوح بالاتر
    throw error;
  }
};

// اکسپورت تابع برای استفاده در سایر فایل‌ها
export default dbConnect;
