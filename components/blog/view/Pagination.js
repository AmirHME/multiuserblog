"use client";
// ایمپورت لینک برای مسیریابی
import Link from "next/link";

import { usePathname } from "next/navigation";


// تعریف کامپوننت Pagination برای نمایش صفحه‌بندی
export default function Pagination({ page, totalPages }) {
  const pathname = usePathname()
  return (
    <nav className="d-flex justify-content-center fixed-bottom">
      {/* نوار پایین صفحه به‌صورت ثابت */}
      <ul className="pagination mb-2">
        {/* دکمه قبلی فقط وقتی صفحه فعلی بزرگ‌تر از 1 باشد */}
        {page > 1 && (
          <li className="page-item">
            <Link
              className="page-link opacity-75"
              href={`${pathname}?page=${parseInt(page) - 1}`}
              as={`${pathname}?page=${parseInt(page) - 1}`}
            >
              قبلی
            </Link>
          </li>
        )}

        {/* دکمه‌های شماره صفحات */}
        {Array.from({ length: totalPages }, (_, index) => {
          const p = index + 1;
          return (
            <li key={p} className="page-item">
              <Link
                className={`page-link ${page === p ? "active" : ""} opacity-75`}
                href={`${pathname}?page=${p}`}
                as={`${pathname}?page=${p}`}
              >
                {p}
              </Link>
            </li>
          );
        })}

        {/* دکمه بعدی فقط وقتی صفحه فعلی کوچک‌تر از totalPages باشد */}
        {page < totalPages && (
          <li className="page-item">
            <Link
              className="page-link opacity-75"
              href={`${pathname}?page=${parseInt(page) + 1}`}
              as={`${pathname}?page=${parseInt(page) + 1}`}
            >
              بعدی
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}




