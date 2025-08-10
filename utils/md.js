// فایل: utils/md.js

// ایمپورت کتابخانه MarkdownIt برای تبدیل متن markdown به HTML
import MarkdownIt from "markdown-it";

// ایمپورت highlight.js برای هایلایت کردن کدهای داخل markdown
import hljs from "highlight.js";

// خروجی یک شیء آماده از MarkdownIt با قابلیت هایلایت
export default new MarkdownIt({
  // تابع highlight برای مشخص کردن استایل کدها بر اساس زبان
  highlight: (str, lang) => {
    // اگر زبانی مشخص شده باشد و توسط hljs پشتیبانی شود، همان استفاده می‌شود؛ در غیر این‌صورت js پیش‌فرض است
    const language = lang && hljs.getLanguage(lang) ? lang : "js";

    try {
      // تلاش برای هایلایت کردن کد
      const highlightedCode = hljs.highlight(language, str, true).value;

      // خروجی HTML با استایل پیش‌فرض و کلاس‌های highlight
      return `<pre class="hljs p-3"><code>${highlightedCode}</code></pre>`;
    } catch (error) {
      // در صورت خطا، خروجی خالی داده می‌شود تا برنامه کرش نکند
      return "";
    }
  },
});