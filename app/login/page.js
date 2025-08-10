// فعال کردن حالت "use client" برای فعال بودن هوک‌ها در سمت کلاینت
"use client";

// ایمپورت هوک‌ها و ابزارهای موردنیاز
import { useState } from "react"; // برای مدیریت state مثل ایمیل و رمز عبور
import toast from "react-hot-toast"; // برای نمایش پیام‌های اطلاع‌رسانی (مثلاً موفق یا خطا)
import { useRouter, useSearchParams } from "next/navigation"; // برای ریدایرکت و گرفتن پارامترهای URL
import { signIn } from "next-auth/react"; // تابع signIn برای ورود با Google یا اعتبارنامه
import Link from "next/link"; // برای لینک‌دهی بدون رفرش

// کامپوننت اصلی فرم ورود
export default function Login() {
  // متغیرهای state برای کنترل فرم و وضعیت بارگذاری
  const [email, setEmail] = useState(""); // مقدار ایمیل ورودی
  const [password, setPassword] = useState(""); // مقدار رمز عبور
  const [loading, setLoading] = useState(false); // وضعیت بارگذاری دکمه ورود
  const [googleLoading, setGoogleLoading] = useState(false); // وضعیت بارگذاری دکمه ورود با گوگل

  const router = useRouter(); // ابزار هدایت به صفحات دیگر
  const searchParams = useSearchParams(); // گرفتن پارامترهای کوئری از URL
  const callbackUrl = searchParams.get("callbackUrl") || "/"; // مسیر برگشت پس از ورود، اگر نبود به صفحه اصلی

  // تابع اجرای ورود با ایمیل و رمز عبور
  const handleSubmit = async (e) => {
    e.preventDefault(); // جلوگیری از رفرش صفحه هنگام ارسال فرم
    setLoading(true); // فعال کردن حالت لودینگ برای دکمه

    // فراخوانی ورود با روش "credentials"
    const result = await signIn("credentials", {
      redirect: false, // اجازه نده خودکار ریدایرکت بشه
      email,
      password,
    });

    setLoading(false); // غیرفعال کردن لودینگ

    if (result.error) {
      toast.error(result.error); // اگر خطا داشت، نمایش پیام خطا
    } else {
      toast.success("ورود با موفقیت انجام شد"); // پیام موفقیت
      router.push(callbackUrl); // هدایت به مسیر callbackUrl
    }
  };

  // تابع اجرای ورود با گوگل
  const handleGoogleSignIn = async () => {
  try {
    setGoogleLoading(true);

    // بررسی اینکه کاربر قبلاً وارد شده یا نه
    const hasSignedInBefore =
      typeof window !== "undefined" && localStorage.getItem("hasSignedIn");

    const result = await signIn("google", {
      redirect: false,
      callbackUrl,
      prompt: hasSignedInBefore ? "none" : undefined, // 🟢 این خط کل موضوعه
    });

    if (result?.error) {
      if (result.error.includes("AccessDenied")) {
        toast.error("دسترسی توسط کاربر لغو شد");
      } else {
        toast.error("خطا در ورود با گوگل");
      }
    } else {
      // ذخیره اینکه کاربر قبلاً وارد شده
      localStorage.setItem("hasSignedIn", "true");
      toast.success("ورود با گوگل موفقیت‌آمیز بود");
      router.push(callbackUrl);
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    toast.error("خطا در ارتباط با سرویس گوگل");
  } finally {
    setGoogleLoading(false);
  }
};


  // خروجی (UI) کامپوننت که شامل فرم ورود و دکمه‌های گوگل و بازیابی رمز است
  return (
    <main>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center vh-10">
          <div className="col-lg-5 p-4 shadow">
            <h2 className="mb-4 lead fw-bold">ورود</h2>

            {/* فرم ورود با ایمیل و رمز */}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // بروز رسانی state ایمیل
                className="form-control p-3 mb-4"
                placeholder="ایمیل"
                required
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // بروز رسانی state رمز
                className="form-control p-3 mb-4"
                placeholder="رمز عبور"
                required
              />

              {/* دکمه ورود با اعتبارنامه */}
              <button
                className="btn btn-lg btn-primary w-100"
                disabled={loading || !email || !password} // وقتی در حال لود هست یا فیلدها خالی‌ان غیرفعاله
              >
                {loading ? "در حال ورود..." : "ورود"}
              </button>
            </form>

            {/* دکمه ورود با گوگل */}
            <button
              className="btn btn-lg btn-danger w-100 my-4"
              onClick={handleGoogleSignIn}
              disabled={googleLoading} // در حالت لود غیرفعاله
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              {googleLoading ? (
                "در حال اتصال به گوگل..."
              ) : (
                <>
                  {/* لوگوی گوگل */}
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#FFF"/>
                  </svg>
                  ورود با گوگل
                </>
              )}
            </button>

            {/* لینک به صفحه فراموشی رمز عبور */}
            <Link className="nav-link text-center" href="/forgot-password">
              فراموشی رمز عبور
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
