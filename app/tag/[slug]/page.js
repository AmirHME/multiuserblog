// app/tag/[slug]/page.js

// ایمپورت کامپوننت BlogCard برای نمایش هر بلاگ
import BlogCard from "@/components/blog/view/BlogCard";

// ایمپورت کامپوننت Pagination برای نمایش صفحه‌بندی
import Pagination from "@/components/blog/view/Pagination";

/**
 * این تابع یک تگ خاص را به همراه بلاگ‌های مرتبطش از API می‌گیرد
 * @param {string} slug - شناسه یا نام تگ (که در URL هست)
 * @param {number} page - شماره صفحه فعلی (پیش‌فرض ۱)
 * @returns {Promise<Object>} - داده‌های شامل بلاگ‌ها، صفحه فعلی، تعداد کل صفحات و اطلاعات تگ
 */
async function getTagWithBlogs(slug, page = 1) {
  // درخواست به API برای گرفتن بلاگ‌های مربوط به یک تگ خاص با صفحه‌بندی
  const response = await fetch(
    `${process.env.API_URL}/tag/${slug}?page=${page}`,
    {
      method: "GET", // متد GET برای گرفتن داده‌ها
      next: { revalidate: 1 }, // تنظیمات کش (revalidate بعد از ۱ ثانیه)
    }
  );

  // اگر درخواست موفق نبود، خطا بده
  if (!response.ok) {
    throw new Error("خطا در دریافت لیست بلاگ‌ها");
  }

  // خروجی رو به JSON تبدیل کن و برگردون
  return await response.json();
}

/**
 * این کامپوننت صفحه نمایش بلاگ‌های مرتبط با یک تگ خاص را می‌سازد
 * @param {Object} props - پارامترهای ورودی از Next.js شامل params و searchParams
 * @returns JSX
 */
export default async function TagWithBlogs({ params, searchParams }) {
  // گرفتن داده‌ها از API با استفاده از تابع getTagWithBlogs
  const { blogs, page, totalPages, tag } = await getTagWithBlogs(
    params?.slug, // استفاده از optional chaining برای جلوگیری از خطا
    searchParams?.page // شماره صفحه از query string
  );

  return (
    <>
      {/* عنوان صفحه */}
      <h1 className="text-center lead mt-3">
        بلاگ‌ها با تگ "{tag?.name}"
      </h1>

      <div className="container">
        {/* نمایش لیست بلاگ‌ها */}
        <div className="row mb-5">
          {blogs?.map((blog) => (
            <div className="col-lg-8 offset-lg-2" key={blog?._id}>
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>

        {/* نمایش صفحه‌بندی */}
        <Pagination page={page} totalPages={totalPages} />
      </div>
    </>
  );
}