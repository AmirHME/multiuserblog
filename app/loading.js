// app/loading.js
// فایل loading.js در پوشه app برای نمایش هنگام بارگذاری صفحات استفاده می‌شود (ویژه App Router در Next.js)

export default function Loading() {
    // تعریف کامپوننت Loading به‌صورت پیش‌فرض (default export)
    
    return (
      <div className="d-flex justify-content-center align-items-center vh-90
      text-danger display-1 fw-bold">
        {/* 
          - d-flex: نمایش فلکس برای چیدن عناصر
          - justify-content-center: مرکز چین افقی
          - align-items-center: مرکز چین عمودی
          - vh-90: ارتفاع ۹۰ درصد از ارتفاع صفحه
          - text-danger: رنگ قرمز (Bootstrap)
          - display-1: سایز فونت خیلی بزرگ
          - fw-bold: فونت پررنگ
        */}
  
        در حال بارگذاری...
        {/* متنی که کاربر هنگام لود شدن صفحه می‌بیند */}
      </div>
    );
  }
  