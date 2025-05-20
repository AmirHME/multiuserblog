"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    
    setLoading(false);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("ورود با موفقیت انجام شد");
      router.push(callbackUrl);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const result = await signIn("google", {
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        if (result.error.includes("AccessDenied")) {
          toast.error("دسترسی توسط کاربر لغو شد");
        } else {
          toast.error("خطا در ورود با گوگل");
        }
      } else {
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

  return (
    <main>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center vh-90">
          <div className="col-lg-5 p-4 shadow">
            <h2 className="mb-4 lead fw-bold">ورود</h2>
            
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control p-3 mb-4"
                placeholder="ایمیل"
                required
              />
              
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control p-3 mb-4"
                placeholder="رمز عبور"
                required
              />
              
              <button
                className="btn btn-lg btn-primary w-100"
                disabled={loading || !email || !password}
              >
                {loading ? "در حال ورود..." : "ورود"}
              </button>
            </form>

            <button
              className="btn btn-lg btn-danger w-100 my-4"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
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
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#FFF"/>
                  </svg>
                  ورود با گوگل
                </>
              )}
            </button>
            
            <Link className="nav-link text-center" href="/forgot-password">
              فراموشی رمز عبور
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}