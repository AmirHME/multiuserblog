/**
 * فایل تنظیمات NextAuth
 * مسیر: utils/authOptions.js
 * 
 * این فایل شامل تمام تنظیمات مورد نیاز برای پیکربندی NextAuth است
 * از جمله استراتژی session، providers، و صفحات سفارشی
 */

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import bcrypt from "bcrypt";
import dbConnect from "@/utils/dbConnect";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),

    CredentialsProvider({
      async authorize(credentials) {
        await dbConnect();
        const { email, password } = credentials;
        const user = await User.findOne({ email });
        
        if (!user) {
          throw new Error("ایمیل یا رمز عبور نامعتبر است");
        }
        
        if (!user?.password) {
          throw new Error("لطفاً از روشی که برای ثبت‌نام استفاده کردید، وارد شوید");
        }
        
        const isPasswordMatched = await bcrypt.compare(password, user?.password);
        
        if (!isPasswordMatched) {
          throw new Error("ایمیل یا رمز عبور نامعتبر است");
        }
        
        return user;
      }
    })
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        await dbConnect();
        
        if (account?.provider === "google") {
          const { email, name, image } = user;
          const dbUser = await User.findOne({ email });
          
          if (!dbUser) {
            const newUser = await User.create({
              email,
              name,
              image,
              provider: "google"
            });
            user.id = newUser._id;
          } else {
            user.id = dbUser._id;
          }
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.provider = account?.provider;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.provider = token.provider;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  pages: {
    signIn: "/login",
    error: "/login"
  }
}; 
