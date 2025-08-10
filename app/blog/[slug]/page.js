// ایمپورت dayjs برای مدیریت و فرمت زمان‌ها
import dayjs from "dayjs";

// ایمپورت افزونه نمایش زمان نسبی مثل "3 ساعت پیش"
import relativeTime from "dayjs/plugin/relativeTime";

// فعال‌سازی افزونه relativeTime
dayjs.extend(relativeTime);

// ایمپورت ابزار رندر Markdown به HTML
import md from "@/utils/md";

// ایمپورت Image از Next.js برای بهینه‌سازی تصاویر
import Image from "next/image";

// تابع async برای واکشی یک بلاگ خاص از API با استفاده از slug
async function getBlog(slug) {
  try {
    // ساخت آدرس API با استفاده از متغیر محیطی
    const apiUrl = `${process.env.API_URL}/blog/${slug}`;

    // ارسال درخواست GET به API
    const response = await fetch(apiUrl, {
      method: "GET",
      next: { revalidate: 1 }, // برای ISR (ساخت مجدد در سرور)
    });

    // اگر پاسخ مناسب نبود، null برگردان
    if (!response.ok) {
      throw new Error(`Failed to fetch blog: ${response.status}`);
    }

    // تبدیل داده دریافتی به JSON
    const data = await response.json();

    // برگرداندن داده
    return data;
  } catch (error) {
    console.error("❌ خطا در واکشی بلاگ:", error);
    return null;
  }
}




// تابع async برای تولید متادیتا داینامیک
export async function generateMetadata({ params }) {
  // واکشی بلاگ بر اساس slug از پارامترهای URL
  const blog = await getBlog(params?.slug);

  // اگر بلاگ وجود نداشت، مقدار پیش‌فرض یا خالی برگردان
  if (!blog) {
    return {
      title: "بلاگ یافت نشد",
      description: "بلاگی با این آدرس وجود ندارد.",
    };
  }

  // تولید متادیتا بر اساس عنوان و محتوای بلاگ
  return {
    title: blog.title,
    description: blog?.excerpt?.substring(0, 160), // 160 کاراکتر اول محتوا 
    image: blog?.featuredImage || "/images/default.jpeg",
  };
}

// کامپوننت صفحه برای نمایش یک بلاگ خاص
export default async function BlogViewPage({ params }) {
  // دریافت slug از پارامترهای URL
  const blog = await getBlog(params?.slug);

  // اگر بلاگ پیدا نشد، نمایش پیام خطا
  if (!blog) {
    return (
      <div className="text-danger fw-bold fs-3 text-center my-5">
        بلاگ مورد نظر یافت نشد!
      </div>
    );
  }

  // نمایش اطلاعات کامل بلاگ
  return (
    <>
      {/* نمایش تصویر شاخص بلاگ */}
      <Image
        src={blog?.featuredImage || "/images/default.jpeg"}
        className="card-img-top"
        width={500}
        height={300}
        style={{
          objectFit: "cover",
          height: "55vh",
          marginTop: "-8vh",
        }}
        alt={blog?.title}
      />

      {/* محتوای اصلی بلاگ */}
      <div className="container my-5">
        <div className="row">
          {/* عنوان بلاگ */}
          <h1 className="fw-bold">{blog?.title}</h1>

          {/* نویسنده و تاریخ انتشار */}
          <p className="lead fw-bold">
            منتشر شده در{" "}
            {dayjs(blog?.createdAt).format("YYYY-MM-DD HH:mm A")} توسط{" "}
            {blog?.postedBy?.name}
          </p>

          {/* نمایش تگ‌ها */}
          <div className="d-flex mb-5">
            {blog?.tags?.map((tag) => (
              <span
                key={tag?._id}
                className="btn btn-outline-primary me-2"
              >
                {tag?.name}
              </span>
            ))}
          </div>

          {/* محتوای بلاگ به صورت Markdown رندر شده */}
          <div className="markdown-preview lead">
            <div
              dangerouslySetInnerHTML={{
                __html: md.render(blog?.content),
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}