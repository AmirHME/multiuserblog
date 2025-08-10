// فعال‌سازی حالت کلاینت چون در این فایل از useEffect و useContext استفاده می‌شود
"use client";

// ایمپورت کامپوننت BlogCard برای نمایش اطلاعات هر بلاگ
import BlogCard from "@/components/blog/view/BlogCard";

// ایمپورت کامپوننت Pagination برای نمایش دکمه‌های صفحه‌بندی
import Pagination from "@/components/blog/view/Pagination";

// ایمپورت useEffect برای اجرای کد هنگام تغییر پارامتر یا بارگذاری اولیه
import { useEffect } from "react";

// ایمپورت useBlog برای دسترسی به context بلاگ‌ها
import { useBlog } from "@/context/blog";

// ایمپورت useSearchParams برای خواندن پارامترهای URL مثل شماره صفحه
import { useSearchParams } from "next/navigation";

// تعریف کامپوننت AuthorBlogs برای نمایش لیست بلاگ‌های نویسنده
export default function AuthorBlogs() {
  // استفاده از useSearchParams برای گرفتن شماره صفحه از آدرس URL
  const searchParams = useSearchParams();

  // خواندن پارامتر page از URL، در صورتی که وجود نداشته باشد مقدار پیش‌فرض 1
  const pageFromURL = searchParams.get("page") || 1;

  // استخراج مقادیر مورد نیاز از context بلاگ
  const { blogs, page, totalPages, fetchAuthorBlogs, blogDelete} = useBlog();

  // هنگام بارگذاری کامپوننت یا تغییر شماره صفحه، بلاگ‌های جدید واکشی می‌شوند
  useEffect(() => {
    fetchAuthorBlogs(pageFromURL);
  }, [pageFromURL]);

  // رندر کردن لیست بلاگ‌ها به صورت دوتایی در ستون‌ها به همراه دکمه‌های صفحه‌بندی
  return (
    <div className="container">
      <div className="row mb-5">
        {/* نمایش هر بلاگ با استفاده از BlogCard در ستون ۶ از ۱۲ */}
        {blogs?.map((blog) => (
          <div className="col-lg-6" key={blog?._id}>
            <BlogCard blog={blog} page="/dashboard/author" />
            <button
  onClick={() => blogDelete(blog?._id)}
  className="btn btn-danger rounded-pill shadow mx-auto m-2 d-block"
>
  X
</button>
          </div>
        ))}
      </div>

      {/* کامپوننت صفحه‌بندی برای جابه‌جایی بین صفحات بلاگ‌ها */}
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}