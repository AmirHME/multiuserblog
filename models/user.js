import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام الزامی است"],
      trim: true,
      minlength: [2, "نام باید حداقل 2 کاراکتر باشد"]
    },
    email: {
      type: String,
      required: [true, "ایمیل الزامی است"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "لطفاً یک ایمیل معتبر وارد کنید"]
    },
    password: {
      type: String,
      required: function() {
        return this.provider === "credentials";
      },
      minlength: [6, "رمز عبور باید حداقل 6 کاراکتر باشد"]
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials"
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    role: {
      type: [String],
      default: ["subscriber"],
      enum: ["subscriber", "admin"]
    },
    image: String,
    resetCode: {
      data: String,
      expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000)
      }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.plugin(uniqueValidator, { message: "{PATH} قبلاً استفاده شده است." });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;