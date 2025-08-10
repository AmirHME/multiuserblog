import Link from "next/link";
// وارد کردن کامپوننت Link برای لینک‌ دادن به صفحات داخلی در برنامه نکست‌جی‌اس

import "highlight.js/styles/monokai.css";
// وارد کردن استایل‌ کتابخانه highlight.js با تم Monokai برای نمایش کدهای رنگی در بلاگ

import Image from "next/image";
// وارد کردن کامپوننت Image از نکست‌جی‌اس برای بهینه‌سازی بارگذاری تصاویر

import md from "@/utils/md";
// وارد کردن تابع تبدیل Markdown به HTML از مسیر مشخص‌شده

import dayjs from "dayjs"; 
// وارد کردن کتابخانه dayjs برای مدیریت تاریخ و زمان

// وارد کردن افزونه‌ای از dayjs برای نمایش نسبی زمان (مثلاً "۲ ساعت پیش")
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fa"; // اضافه کردن زبان فارسی

dayjs.extend(relativeTime);
dayjs.locale("fa");  // تنظیم زبان به فارسی
// فعال‌سازی افزونه نمایش زمان نسبی در کتابخانه dayjs

// تعریف کامپوننت BlogCard که اطلاعات یک بلاگ را در قالب یک کارت نمایش می‌دهد
export default function BlogCard({ blog, page = "" }) {
  return (
    // کارت اصلی با کلاس Bootstrap و اعمال سایه، فاصله بالا، عرض کامل و حداکثر عرض ۷۰۰ پیکسل
    <div className="card mt-5 shadow mx-auto" style={{ maxWidth: "700px", padding: 0 }}>

      {/* بخش تصویر شاخص بلاگ با ارتفاع ثابت و پوشش کامل عرض کارت */}
      <Link href={`/blog/${blog?.slug}`}>
        <div style={{ height: "250px", overflow: "hidden" }}>
          <Image
            src={blog?.featuredImage || "/images/default.jpeg"} // آدرس تصویر شاخص یا تصویر پیش‌فرض
            className="card-img-top" // کلاس Bootstrap برای تنظیم ظاهر تصویر بالای کارت
            width={500} // عرض تصویر (غیرفعال در این حالت چون style تعیین شده)
            height={400} // ارتفاع تصویر (غیرفعال در این حالت چون style تعیین شده)
            style={{
              display: "block", // نمایش به‌صورت بلوک برای حذف فاصله اضافی پایین
              objectFit: "cover", // بریدن تصویر برای پر کردن کل قاب بدون تغییر نسبت تصویر
              width: "100%", // تنظیم عرض کامل نسبت به والد
              height: "100%" // تنظیم ارتفاع کامل
            }}
            alt={blog?.title} // مقدار جایگزین تصویر برای دسترس‌پذیری
          />
        </div>
      </Link>

      {/* بخش بدنه کارت شامل عنوان و خلاصه متن بلاگ */}
      <div className="card-body px-9">
        {/* پدینگ افقی سفارشی برای فاصله مناسب از چپ و راست */}

        {/* عنوان بلاگ به صورت لینک قابل کلیک به صفحه جزئیات بلاگ */}
        <h3 className="card-title">
          <Link 
            className="link-underline link-underline-opacity-0 text-muted fw-bold" // کلاس‌های Bootstrap برای استایل لینک
            href={`${page}/blog/${blog?.slug}`} // مسیر لینک به صفحه بلاگ
          >
            {blog?.title} {/* نمایش عنوان بلاگ */}
          </Link>
        </h3>

        {/* نمایش خلاصه محتوای بلاگ به‌صورت HTML */}
        <div className="card-text">
          <div className="markdown-preview">
            <div
              dangerouslySetInnerHTML={{
                __html: blog?.excerpt || "", // تبدیل محتوای Markdown به HTML و قرار دادن در صفحه
              }}
            />
          </div>
        </div>
      </div>

      {/* فوتر کارت برای نمایش تعداد لایک‌ها و نویسنده با زمان نسبی انتشار */}
      <div className="card-footer d-flex justify-content-between align-items-center px-4">
        <div>💙 0 نفر پسندیدن</div> {/* نمایش تعداد لایک‌ها */}
        <div className="text-muted text-end form-text">
          🕒 {dayjs(blog?.createdAt).fromNow()} {/* نمایش زمان نسبی انتشار بلاگ */}
          ✏ {blog?.postedBy?.name || "ادمین"} {/* نام نویسنده یا واژه پیش‌فرض "ادمین" */}
        </div>
      </div>

      {/* فوتر دوم کارت برای نمایش برچسب‌ها (تگ‌ها) به‌صورت دکمه‌های کوچک */}
      <div className="card-footer d-flex px-4">
        {blog?.tags?.map((t) => (
          <Link
            className="btn btn-sm btn-secondary me-2" // دکمه Bootstrap با اندازه کوچک و رنگ دوم
            key={t?._id} // کلید یکتا برای هر تگ
            href={`/tag/${t?.slug}`} // لینک به صفحه مرتبط با تگ
          >
            {t?.name} {/* نمایش نام تگ */}
          </Link>
        ))}
      </div>
    </div>
  );
}


