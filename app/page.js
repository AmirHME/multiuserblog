export default function Home() {
  // تعریف کامپوننت اصلی صفحه Home

  return (
    <div className="d-flex justify-content-center align-items-center vh-90">
      {/* مرکزچین کردن محتوا به‌صورت افقی و عمودی با ارتفاع ۹۰٪ صفحه */}

      <div className="text-center">
        {/* مرکزچین کردن محتوای داخلی */}

        <h1 className="display-5 fw-bold">
          {/* عنوان بزرگ و پررنگ */}
          !به نکست بلاگ خوش اومدین
        </h1>

        <hr />
        {/* خط افقی جداکننده */}

        <p className="lead text-center">
          {/* متن توضیحی درباره پلتفرم */}
          پلتفرمی برای انتشار بلاگ‌های شما
        </p>

      </div>

    </div>
  );
}
