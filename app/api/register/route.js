
// npm i bcrypt - این دستور برای نصب کتابخانه bcrypt استفاده می‌شود که برای رمزنگاری رمزهای عبور ضروری است

// app/api/register/route - این مسیر فایل در ساختار پروژه Next.js است

import { NextResponse } from 'next/server'; 
// وارد کردن NextResponse از پکیج next/server برای ارسال پاسخ‌های HTTP
import dbConnect from '@/utils/dbConnect'; 
// وارد کردن تابع اتصال به پایگاه داده از فایل dbConnect
import User from '@/models/user'; 
// وارد کردن مدل User که ساختار داده‌های کاربر را تعریف می‌کند
import bcrypt from 'bcrypt'; 
// وارد کردن کتابخانه bcrypt برای رمزنگاری رمزهای عبور


// تابع POST برای پردازش درخواست‌های ثبت‌نام کاربران

// در Next.js App Router، نام این تابع (POST) مشخص می‌کند که فقط به درخواست‌های POST پاسخ می‌دهد

// پارامتر req (درخواست) شامل تمام اطلاعات درخواست از سمت کاربر است
export async function POST(req) {
  try {
    
// اتصال به دیتابیس با استفاده از تابع dbConnect
    
// از await استفاده می‌کنیم چون اتصال به دیتابیس یک عملیات غیرهمزمان است
    await dbConnect();
    console.log('Connected to database successfully'); 
// پیام تأیید اتصال موفق به دیتابیس

    
// استخراج داده‌های ارسال شده در بدنه درخواست با متد json()
    
// از destructuring assignment در JavaScript استفاده می‌کنیم تا فیلدها را استخراج کنیم
    const { name, email, password } = await req.json();
    console.log('Received registration data:', { name, email }); 
// ثبت داده‌های دریافتی در کنسول (بدون رمز عبور برای امنیت)

    
// بررسی فیلدهای اجباری - اگر هر کدام از فیلدها خالی باشند
    
// عملگر ! به معنای "نه" یا "خالی بودن" است
    
// عملگر || به معنای "یا" منطقی است
    if (!name || !email || !password) {
      return NextResponse.json(
        { err: 'All fields are required' }, 
// پیام خطا
        { status: 422 } 
// کد وضعیت HTTP 422 (Unprocessable Entity) - یعنی درخواست قابل پردازش نیست
      );
    }

    
// بررسی وجود کاربر با ایمیل مشابه در پایگاه داده
    
// از متد findOne در Mongoose استفاده می‌کنیم تا اولین سند منطبق با معیار (ایمیل) را پیدا کنیم
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email); 
// ثبت تلاش تکراری در کنسول
      return NextResponse.json(
        { err: 'Email is already taken' }, 
// پیام خطا
        { status: 422 } 
// کد وضعیت HTTP 422
      );
    }

    
// هش کردن رمز عبور با bcrypt برای ذخیره‌سازی امن
    
// عدد 10 فاکتور هزینه (cost factor) است - هرچه بزرگتر باشد، هش قوی‌تر اما زمان محاسبه طولانی‌تر است
    const hashedPassword = await bcrypt.hash(password, 10);

    
// ایجاد یک نمونه جدید از مدل User با داده‌های دریافتی
    
// به جای رمز عبور اصلی، نسخه هش شده آن ذخیره می‌شود
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    
// ذخیره کاربر جدید در پایگاه داده
    
// متد save() یک عملیات غیرهمزمان است که رکورد جدید را در کالکشن مربوطه اضافه می‌کند
    await user.save();
    console.log('User created successfully'); 
// پیام موفقیت‌آمیز بودن عملیات

    
// ارسال پاسخ موفقیت به کاربر با استفاده از NextResponse.json
    
// اطلاعات کاربر (به جز رمز عبور) برگردانده می‌شود
    return NextResponse.json({
      success: 'User created successfully',
      user: {
        name: user.name,
        email: user.email,
        role: user.role, 
// نقش کاربر (احتمالاً یک مقدار پیش‌فرض در مدل User)
      },
    });
  } catch (err) {
    
// بلوک catch برای مدیریت خطاهایی که ممکن است در بلوک try رخ دهند
    console.error('Registration error:', err); 
// ثبت خطا در کنسول برای دیباگ

    
// بررسی نوع خطا و ارسال پاسخ متناسب
    
// MongoServerSelectionError زمانی رخ می‌دهد که اتصال به سرور MongoDB ناموفق باشد
    if (err.name === 'MongoServerSelectionError') {
      return NextResponse.json(
        { err: 'Could not connect to database. Please try again later.' }, 
// پیام خطا
        { status: 503 } 
// کد وضعیت HTTP 503 (Service Unavailable) - سرویس موقتاً در دسترس نیست
      );
    }

    
// ValidationError زمانی رخ می‌دهد که داده‌ها با قوانین اعتبارسنجی مدل Mongoose مطابقت ندارند
    if (err.name === 'ValidationError') {
      return NextResponse.json({ err: err.message }, { status: 422 });
    }

    
// برای سایر خطاها، یک پیام خطای عمومی برمی‌گردانیم
    
// کد وضعیت HTTP 500 (Internal Server Error) - خطای داخلی سرور
    return NextResponse.json(
      { err: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}

