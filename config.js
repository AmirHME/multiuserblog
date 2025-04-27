/**
 * فایل config.js
 * این فایل شامل متغیرهای محیطی و تنظیمات حساس پروژه است
 * 
 * نکته مهم: این فایل باید به .gitignore اضافه شود
 * چون شامل اطلاعات حساس مانند کلیدهای رمزگذاری و رمزهای عبور است
 */

// دریافت آدرس دیتابیس از متغیر محیطی
const DB_URI = process.env.DB_URI;  // آدرس دیتابیس MongoDB

// دریافت آدرس API از متغیر محیطی
const API = process.env.API_URL;  // آدرس API برای ارتباط با سرویس‌های خارجی

// نام "NEXTAUTH_SECRET" مهم است، آن را تغییر ندهید
// این متغیر برای رمزگذاری توکن‌های JWT در NextAuth استفاده می‌شود
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;  // این را از متغیر محیطی دریافت می‌کنیم

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;






// اکسپورت متغیرها برای استفاده در سایر فایل‌ها
module.exports = {
  DB_URI,  // آدرس دیتابیس MongoDB
  API,  // آدرس API برای ارتباط با سرویس‌های خارجی
  NEXTAUTH_SECRET,  // کلید رمزگذاری برای NextAuth
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
};
