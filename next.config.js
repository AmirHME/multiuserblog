/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",         // فقط تصاویر HTTPS مجاز هستند
          hostname: "res.cloudinary.com", // دامنه‌ای که تصاویر از آن بارگذاری می‌شوند
        },
      ],
    },
  };
  
  module.exports = nextConfig; // خروجی تنظیمات برای Next.js





