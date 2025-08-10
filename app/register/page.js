
// npm i react-hot-toast - نصب کتابخانه اعلان پاپ آپ برای نمایش پیام‌های بازخورد به کاربر

// put <Toaster /> in layout inside <body> - کامپوننت Toaster باید در فایل layout داخل تگ body قرار بگیرد

// app/register/page - مسیر این فایل در ساختار پروژه که صفحه ثبت‌نام را پیاده‌سازی می‌کند
'use client'; 
// این دستور به Next.js اعلام می‌کند که این کامپوننت باید در سمت کلاینت (مرورگر) اجرا شود، نه سرور

import { useState } from 'react'; 

// وارد کردن هوک useState برای مدیریت state در کامپوننت تابعی
import { useRouter } from 'next/navigation'; 

// وارد کردن هوک router برای هدایت کاربر به صفحات دیگر
import Link from 'next/link'; 

// وارد کردن کامپوننت Link برای ناوبری بدون بارگذاری مجدد کل صفحه
import toast from 'react-hot-toast'; 

// وارد کردن کتابخانه toast برای نمایش اعلان‌های پاپ‌آپ به کاربر


// کامپوننت اصلی صفحه ثبت نام - تابعی که UI صفحه ثبت‌نام را تعریف و رندر می‌کند
export default function Register() {
  
// تعریف state برای فرم - هوک useState برای ذخیره و مدیریت داده‌های فرم
  const [name, setName] = useState(''); 
// state برای ذخیره نام کاربر
  const [email, setEmail] = useState(''); 
// state برای ذخیره ایمیل کاربر
  const [password, setPassword] = useState(''); 
// state برای ذخیره رمز عبور کاربر
  const [loading, setLoading] = useState(false); 
// state برای مدیریت وضعیت بارگذاری (لودینگ)

  
// دریافت router برای هدایت کاربر - دسترسی به API مسیریابی Next.js
  const router = useRouter();

  
// تابع ارسال فرم - این تابع زمانی اجرا می‌شود که کاربر دکمه ثبت‌نام را فشار می‌دهد
  const handleSubmit = async (e) => {
    e.preventDefault(); 
// جلوگیری از رفتار پیش‌فرض فرم که باعث بارگذاری مجدد صفحه می‌شود
    try {
      
// شروع لودینگ - به روزرسانی state برای نمایش وضعیت بارگذاری به کاربر
      setLoading(true);

      
// ارسال درخواست به API - ارسال اطلاعات ثبت‌نام به اندپوینت API در سرور
      const response = await fetch(`/api/register`, {
        method: 'POST', 
// متد HTTP از نوع POST
        headers: {
          'Content-Type': 'application/json', 
// نوع محتوای ارسالی از نوع JSON است
        },
        body: JSON.stringify({ 
// تبدیل اطلاعات به رشته JSON
          name, 
// نام کاربر از state
          email, 
// ایمیل کاربر از state
          password, 
// رمز عبور کاربر از state
        }),
      });

      
// دریافت پاسخ - استخراج داده‌های JSON از پاسخ سرور
      const data = await response.json();

      
// بررسی موفقیت‌آمیز بودن درخواست - کد وضعیت HTTP باید در محدوده 200-299 باشد
      if (!response.ok) {
        
// نمایش خطا - نمایش پیام خطا با استفاده از toast.error
        toast.error(data.err);
        return; 
// خروج از تابع در صورت خطا
      }

      
// نمایش پیام موفقیت - اعلان پاپ‌آپ سبز رنگ برای موفقیت
      toast.success('ثبت نام با موفقیت انجام شد');
      
      
// هدایت به صفحه ورود - پس از ثبت‌نام موفق، کاربر به صفحه ورود هدایت می‌شود
      router.push('/login');
    } catch (err) {
      
// نمایش خطای سیستمی - مدیریت خطاهای احتمالی در اجرای کد
      console.error(err); 
// ثبت خطا در کنسول برای مقاصد دیباگ
      toast.error('خطا در ثبت نام. لطفاً دوباره تلاش کنید'); 
// نمایش پیام خطای عمومی به کاربر
    } finally {
      
// پایان لودینگ - این بلوک همیشه اجرا می‌شود، چه خطایی رخ دهد چه ندهد
      setLoading(false); 
// به‌روزرسانی state لودینگ به false
    }
  };

  
// رندر فرم ثبت نام - بخش JSX که تمام عناصر UI صفحه را تعریف می‌کند
  return (
    <div className="container"> 
{/* کانتینر اصلی با استایل Bootstrap */}
      <div className="row d-flex justify-content-center align-items-center vh-10"> 
{/* ردیفی که محتوا را در مرکز صفحه قرار می‌دهد */}
        <div className="col-lg-5 shadow p-5 bg-body-tertiary rounded"> 
{/* ستونی با سایه، پدینگ و گوشه‌های گرد */}
          <h2 className="mb-4 text-center">ثبت نام</h2> 
{/* عنوان صفحه با استایل متن وسط‌چین */}

          <form onSubmit={handleSubmit}> 
{/* فرم که به رویداد onSubmit تابع handleSubmit را متصل می‌کند */}
            
{/* فیلد نام - ورودی برای نام کاربر */}
            <input
              type="text" 
// نوع ورودی متنی
              value={name} 
// مقدار فیلد از state name
              onChange={(e) => setName(e.target.value)} 
// به‌روزرسانی state با تغییر مقدار فیلد
              className="form-control mb-4" 
// استایل‌های Bootstrap
              placeholder="نام" 
// متن نمایشی قبل از ورود داده
              required 
// فیلد اجباری است
            />

            
{/* فیلد ایمیل - ورودی برای ایمیل کاربر */}
            <input
              type="email" 
// نوع ورودی ایمیل که اعتبارسنجی اولیه فرمت ایمیل را فراهم می‌کند
              value={email} 
// مقدار فیلد از state email
              onChange={(e) => setEmail(e.target.value)} 
// به‌روزرسانی state با تغییر مقدار فیلد
              className="form-control mb-4" 
// استایل‌های Bootstrap
              placeholder="ایمیل" 
// متن نمایشی قبل از ورود داده
              required 
// فیلد اجباری است
            />

            
{/* فیلد رمز عبور - ورودی برای رمز عبور کاربر */}
            <input
              type="password" 
// نوع ورودی رمز عبور که کاراکترها را مخفی می‌کند
              value={password} 
// مقدار فیلد از state password
              onChange={(e) => setPassword(e.target.value)} 
// به‌روزرسانی state با تغییر مقدار فیلد
              className="form-control mb-4" 
// استایل‌های Bootstrap
              placeholder="رمز عبور" 
// متن نمایشی قبل از ورود داده
              required 
// فیلد اجباری است
            />

            
{/* دکمه ثبت نام - دکمه ارسال فرم */}
            <button
              className="btn btn-primary btn-block" 
// استایل‌های Bootstrap برای دکمه اصلی با عرض کامل
              disabled={loading || !name || !email || !password} 
// غیرفعال می‌شود اگر در حال بارگذاری باشد یا هر یک از فیلدها خالی باشند
            >
              {loading ? 'در حال ثبت نام...' : 'ثبت نام'} 
{/* متن دکمه بسته به وضعیت لودینگ تغییر می‌کند */}
            </button>

            
{/* لینک به صفحه ورود - برای کاربرانی که قبلاً ثبت‌نام کرده‌اند */}
            <p className="text-center mt-4"> 
{/* پاراگراف با متن وسط‌چین و حاشیه بالا */}
              قبلاً ثبت نام کرده‌اید؟ <Link href="/login">وارد شوید</Link> 
{/* لینک به صفحه ورود */}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

