// ایمپورت کامپوننت کارت بلاگ
import BlogCard from "@/components/blog/view/BlogCard";

// ایمپورت لینک برای مسیریابی صفحات در نکست
import Link from "next/link";

// ایمپورت کامپوننت صفحه‌بندی
import Pagination from "@/components/blog/view/Pagination";
import Tags from "@/components/tag/tags";

// تعریف metadata برای بهبود SEO صفحه
export const metadata = {
  title: "Blogs", // عنوان صفحه (نمایش در مرورگر و موتورهای جستجو)
  description: "Browse a collection of technology, design, and programming topics", // توضیح کوتاه درباره محتوای صفحه
};

// تابع برای دریافت لیست بلاگ‌ها از API با صفحه‌بندی
async function getBlogs(page = 1) {
  const response = await fetch(`${process.env.API_URL}/blogs?page=${page}`, {
    method: "GET", // ارسال درخواست GET
    next: { revalidate: 1 }, // فعال‌سازی ISR برای بازسازی هر ثانیه
  });

  if (!response.ok) {
    // بررسی خطا در پاسخ
    throw new Error("Failed to fetch blogs.");
  }

  return await response.json(); // تبدیل پاسخ به JSON و بازگرداندن آن
}

// کامپوننت اصلی صفحه Home





export default async function Home({ searchParams }) {
  const page = parseInt(searchParams?.page) || 1;
  const { blogs, totalPages } = await getBlogs(page);

  return (
    <div className="container">
      {/* بخش هدر */}
      <div className="row mb-5 text-center">
        <div className="col-12">
          <h1 className="display-5 fw-bold">نکست بلاگ</h1>
          <hr />
          <p className="lead">پلتفرمی برای انتشار بلاگ‌های شما</p>
        </div>
      </div>

      {/* بخش تگ‌ها */}
      <div className="row justify-content-center mb-5">
        <div className="col-12 text-center">
          <Tags />
        </div>
      </div>

      {/* بخش کارت‌های بلاگ */}
      <div className="row justify-content-center">
        {blogs?.map((blog) => (
          <div className="col-lg-8" key={blog._id}>
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>

      {/* صفحه‌بندی */}
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}