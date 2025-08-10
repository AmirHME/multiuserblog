// تعریف صفحه داشبورد نویسنده که در آدرس /dashboard/author قرار دارد
export default function AuthorDashboard() {
    return (
      // استفاده از کلاس container برای تنظیم فاصله‌ها و عرض مناسب
      <div className="container">
        <div className="row">
          <div className="col">
  
            {/* یک متن معرفی برای نویسنده */}
            <p className="lead">داشبورد نویسنده</p>
  
            {/* خط جداکننده افقی */}
            <hr />
  
            {/* ... در اینجا می‌توان محتوای اختصاصی بیشتری برای نویسنده قرار داد */}
  
          </div>
        </div>
      </div>
    );
  }
  