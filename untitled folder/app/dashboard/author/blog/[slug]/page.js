"use client";

// ایمپورت ابزارهای موردنیاز از React و Next.js
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";

// ایمپورت context مربوط به بلاگ برای دسترسی به state و توابع
import { useBlog } from "@/context/blog";

// ایمپورت کامپوننت‌های هر مرحله از فرم بلاگ
import BlogTitle from "@/components/blog/BlogTitle";
import BlogContent from "@/components/blog/BlogContent";
import Tags from "@/components/blog/BlogTags";
import FeaturedImage from "@/components/blog/FeaturedImage";
import ReviewAndSubmit from "@/components/blog/ReviewAndSubmit";

export default function ویرایش_بلاگ() {
  const { slug } = useParams(); // گرفتن slug از URL

  // گرفتن مقادیر از context
  const {
    title,
    markdown,
    selectedTags,
    featuredImage,
    step,
    setStep,
    handleNextStep,
    handlePrevStep,
    current,
    getUpdatingBlog,
  } = useBlog();

  const router = useRouter(); // برای تغییر آدرس URL
  const searchParams = useSearchParams(); // گرفتن query string مانند step

  // ✅ حالت لودینگ برای جلوگیری از رندر زود هنگام فرم
  const [isLoading, setIsLoading] = useState(true);

  // واکشی اطلاعات بلاگ از API وقتی slug آماده بود
  useEffect(() => {
    if (slug) {
      setIsLoading(true); // شروع لودینگ
      getUpdatingBlog(slug).finally(() => {
        setIsLoading(false); // پایان لودینگ
      });
    }
  }, [slug]);

  // گرفتن مقدار اولیه مرحله از query string
  useEffect(() => {
    const stepFromQuery = searchParams.get("step");
    if (stepFromQuery !== null) {
      const stepNumber = parseInt(stepFromQuery, 10);
      if (!isNaN(stepNumber)) {
        setStep(stepNumber);
      }
    }
  }, []);

  // هر بار که step تغییر کرد، آن را در آدرس URL نیز آپدیت کن
  useEffect(() => {
    if (slug) {
      router.push(`/dashboard/author/blog/${slug}?step=${step}`);
    }
  }, [step]);

  // در حالت لودینگ، فقط پیام بارگذاری نمایش داده شود
  if (isLoading) return <div className="text-center my-5">در حال بارگذاری اطلاعات بلاگ...</div>;

  return (
    <div className="container-fluid">
      {/* نوار بالای مراحل فرم */}
      <div className="container my-5">
        <div className="d-flex justify-content-between lead pointer">
          <div onClick={() => setStep(1)}>
            {current(1, title?.trim())} عنوان بلاگ
          </div>
          <div onClick={() => setStep(2)}>
            {current(2, markdown?.trim().length > 60)} محتوای بلاگ
          </div>
          <div onClick={() => setStep(3)}>
            {current(3, selectedTags?.length > 0)} تگ‌ها
          </div>
          <div onClick={() => setStep(4)}>
            {current(4, featuredImage)} تصویر شاخص
          </div>
          <div onClick={() => setStep(5)}>{current(5)} بررسی و انتشار</div>
        </div>
      </div>

      {/* نمایش هر مرحله از فرم بسته به مقدار step */}
      {step === 1 && <BlogTitle onNextStep={handleNextStep} />}
      {step === 2 && (
        <BlogContent
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
        />
      )}
      {step === 3 && (
        <Tags onNextStep={handleNextStep} onPrevStep={handlePrevStep} />
      )}
      {step === 4 && (
        <FeaturedImage
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
        />
      )}
      {step === 5 && <ReviewAndSubmit onPrevStep={handlePrevStep} update={true} />}
    </div>
  );
}





  