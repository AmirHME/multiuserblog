
// Import تنظیمات از فایل config.js
const config = require("./config");


// تعریف پیکربندی Next.js
/** @type {import('next').NextConfig} */
const nextConfig = { 
  
// تعریف متغیرهای محیطی قابل دسترسی در کلاینت و سرور
  env: {
    DB_URI: config.DB_URI, 
// رشته اتصال به دیتابیس
    API: config.API, 
// آدرس API
  },
};


// Export پیکربندی
module.exports = nextConfig;
