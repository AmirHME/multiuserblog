import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import bcrypt from "bcrypt";
import dbConnect from "@/utils/dbConnect";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    }),
    CredentialsProvider({
      async authorize(credentials) {
        await dbConnect();
        const { email, password } = credentials;

        const user = await User.findOne({ email });
        if (!user) throw new Error("ایمیل یا رمز عبور اشتباه است");
        if (!user?.password) throw new Error("رمز برای این حساب تنظیم نشده است");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("ایمیل یا رمز عبور اشتباه است");

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await dbConnect();
        console.log("✅ Google SignIn started", { user: user.email, providerId: account.providerAccountId });

        if (account.provider === "google") {
          const existingUser = await User.findOne({
            $or: [
              { email: user.email },
              { googleId: account.providerAccountId }
            ]
          });

          if (!existingUser) {
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: "google",
              googleId: account.providerAccountId
            });
            user.id = newUser._id.toString();
            console.log("✅ New user created via Google");
          } else {
            user.id = existingUser._id.toString();
            console.log("✅ Existing Google user found");
          }
        }

        return true;
      } catch (error) {
        console.error("❌ Error in signIn callback", error);
        return false;
      }
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    }
  },
  pages: {
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET
};
