import GoogleProvider from "next-auth/providers/google"; // وارد کردن Provider گوگل برای ورود با اکانت Google
import CredentialsProvider from "next-auth/providers/credentials"; // وارد کردن Provider ورود با ایمیل و رمز عبور (سفارشی)
import User from "@/models/user"; // وارد کردن مدل کاربر برای جستجو یا ایجاد کاربر در پایگاه داده
import bcrypt from "bcrypt"; // برای مقایسه رمز عبور واردشده با رمز هش‌شده
import dbConnect from "@/utils/dbConnect"; // تابع اتصال به پایگاه داده MongoDB

export const authOptions = {
  session: {
    strategy: "jwt", // استفاده از توکن JWT برای مدیریت سشن
    maxAge: 30 * 24 * 60 * 60, // مدت اعتبار سشن: ۳۰ روز
  },

  providers: [
    // لیست روش‌های ورود
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID, // کلاینت آیدی گوگل (از محیط تنظیمات)
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // کلاینت سکرت گوگل
      authorization: {
        params: {
          prompt: "select_account", // از کاربر می‌پرسه کدوم اکانت رو می‌خواد استفاده کنه
          access_type: "offline", // اجازه دسترسی بلندمدت (رفرش توکن)
          response_type: "code", // نوع پاسخ دریافتی از گوگل
          scope: "openid email profile" // اطلاعاتی که از گوگل دریافت می‌کنیم
        }
      }
    }),

    CredentialsProvider({
      // ورود با ایمیل و رمز عبور دستی (سفارشی)
      async authorize(credentials) {
        await dbConnect(); // اتصال به پایگاه داده
        const { email, password } = credentials; // دریافت ایمیل و رمز عبور از فرم

        const user = await User.findOne({ email }); // جستجوی کاربر با ایمیل در پایگاه داده
        if (!user) throw new Error("ایمیل یا رمز عبور اشتباه است"); // اگر کاربری با این ایمیل نبود

        if (!user?.password) throw new Error("رمز برای این حساب تنظیم نشده است"); // اگر رمز عبور نداره (مثلاً کاربر گوگل باشه)

        const isMatch = await bcrypt.compare(password, user.password); // بررسی صحت رمز عبور
        if (!isMatch) throw new Error("ایمیل یا رمز عبور اشتباه است"); // رمز اشتباهه

        return {
          // در صورت موفقیت، اطلاعات کاربر بازمی‌گردانیم
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],

  callbacks: {
    // توابعی که قبل یا بعد از ورود اجرا می‌شن

    async signIn({ user, account }) {
      try {
        await dbConnect(); // اتصال به پایگاه داده

        console.log("✅ Google SignIn started", {
          user: user.email,
          providerId: account.providerAccountId
        });

        if (account.provider === "google") {
          // اگر ورود با گوگل باشه
          const existingUser = await User.findOne({
            // جستجوی کاربر بر اساس ایمیل یا Google ID
            $or: [
              { email: user.email },
              { googleId: account.providerAccountId }
            ]
          });

          if (!existingUser) {
            // اگر کاربر وجود نداشت، کاربر جدید بساز
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: "google",
              role: ["subscriber"],
              googleId: account.providerAccountId
            });
            user.id = newUser._id.toString(); // مقدار id به user اختصاص بده
            console.log("✅ New user created via Google");
          } else {
            // اگر کاربر قبلاً ثبت‌نام کرده بود
            user.id = existingUser._id.toString(); // مقدار id موجود رو ذخیره کن
            console.log("✅ Existing Google user found");
          }
        }

        return true; // اجازه ادامه ورود
      } catch (error) {
        console.error("❌ Error in signIn callback", error); // خطا در ورود
        return false; // اجازه نده ورود انجام بشه
      }
    },

    session: async ({ session, token }) => {
      // اطلاعات ذخیره‌شده در JWT را به session منتقل می‌کنیم
      session.user.id = token.id; // ⬅️ شناسه کاربر را به session اضافه کن
      session.user.email = token.email; // ⬅️ ایمیل کاربر را به session اضافه کن
      session.user.role = token.role; // ⬅️ نقش کاربر را هم به session اضافه کن (مثلاً ["admin"])
    
      // session را بازمی‌گردانیم تا در کلاینت استفاده شود
      return session;
    },
    

    jwt: async ({ token, user }) => {
      // اگر کاربر تازه وارد شده (مثلاً در مرحله ورود)، اطلاعاتش موجوده
      if (user) {
        token.id = user.id; // ⬅️ شناسه کاربر را در توکن ذخیره کن
        token.email = user.email; // ⬅️ ایمیل کاربر را در توکن ذخیره کن
        token.role = user.role || ["subscriber"]; // ⬅️ نقش کاربر را ذخیره کن؛ اگر نبود مقدار پیش‌فرض بده
      }
    
      // همیشه باید توکن را در انتها بازگردانیم
      return token;
    },
    
  },

  pages: {
    error: "/login" // صفحه‌ای که در صورت خطا به آن ریدایرکت می‌شود
  },

  secret: process.env.NEXTAUTH_SECRET // کلید رمزنگاری JWT و سشن‌ها
};
