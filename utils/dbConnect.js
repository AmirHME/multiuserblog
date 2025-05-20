import mongoose from 'mongoose';

// استفاده از نام متغیر دقیقاً مثل فایل .env.local
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  throw new Error('❌ لطفاً متغیر محیطی DB_URI را در فایل .env.local تعریف کنید');
}

/**
 * اتصال به دیتابیس MongoDB (فقط یکبار)
 */
async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    console.log('✅ MongoDB already connected');
    return;
  }

  try {
    console.log('🔌 Connecting to MongoDB...');

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    };

    await mongoose.connect(DB_URI, options);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export default dbConnect;
