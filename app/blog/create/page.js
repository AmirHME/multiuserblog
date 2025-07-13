"use client"
// وارد کردن کامپوننت فرم بلاگ از مسیر components/blog
import BlogForm from "@/components/blog/BlogForm";
// وارد کردن کامپوننت فرم تگ‌ها از مسیر components/tag
import TagForm from "@/components/tag/TagForm";
// وارد کردن کامپوننت تصویر شاخص از مسیر components/blog
import FeaturedImage from "@/components/blog/FeaturedImage";

// وارد کردن هوک useBlog برای دسترسی به context بلاگ
import { useBlog } from "@/context/blog";


// تعریف کامپوننت صفحه ایجاد بلاگ
export default function BlogCreatePage() {
  const { blogCreate } = useBlog();

  return (
    // یک کانتینر (container) از بوت‌استرپ برای قرار دادن محتوای صفحه
    <div className="container">

      {/* ردیف اول که شامل فرم اصلی بلاگ است */}
      <div className="row">
        <div className="col">
          {/* نمایش کامپوننت فرم بلاگ */}
          <BlogForm />
        </div>
      </div>

      {/* ردیف دوم که شامل فرم تگ‌ها است و با margin عمودی (my-5) فاصله دارد */}
      <div className="row my-5">
        <div className="col">
          {/* نمایش کامپوننت فرم تگ‌ها */}
          <TagForm />
        </div>
      </div>

      {/* بخش سوم که یک بخش انعطاف‌پذیر (flex) است برای قرار دادن تصویر شاخص و دکمه انتشار */}
      <div className="d-flex mb-5">
        {/* ستون سمت چپ که تصویر شاخص را در خودش دارد
            col-lg-6 یعنی در صفحه‌های بزرگ 6 ستون عرض دارد (نیم صفحه)
            p-5 برای padding
            rounded برای گوشه‌های گرد
            btn btn-outline-secondary برای ظاهر دکمه‌ای حاشیه‌ای به رنگ ثانویه
            me-2 برای فاصله سمت راست (margin-end) */}
        <div className="col-lg-6 p-5 rounded btn btn-outline-secondary me-2">
          <FeaturedImage />
        </div>

        {/* ستون سمت راست که دکمه انتشار را نمایش می‌دهد
            col-lg-6 یعنی نیم صفحه در صفحات بزرگ
            p-5 برای padding
            rounded برای گوشه‌های گرد
            btn btn-primary برای دکمه با رنگ اصلی (آبی) */}
        <div 
          onClick={blogCreate}
          className="col-lg-6 p-5 rounded btn btn-primary m-2"
        >
  انتشار
</div>
      </div>
    </div>
  );
}


