"use client";

import { useBlog } from "@/context/blog";
import { useEffect } from "react";
import Link from "next/link";

export default function Tags() {
  const { tags, tagList } = useBlog();

  useEffect(() => {
    tagList();
  }, []);

  return (
    <div className="d-flex align-items-center vh-80 justify-content-center">
      <div className="row text-center col-lg-8 my-5">
        <div
          className="col custom-scrollbar d-flex flex-wrap justify-content-center"
          style={{ 
            maxHeight: "280px", 
            overflow: "auto",
            padding: "1rem"
          }}
        >
          {tags?.length > 0 ? (
            tags?.map((tag) => (
              <Link 
                key={tag?._id} 
                href={`/tag/${tag?.slug}`} 
                className="m-1"
              >
                <button className="btn btn-lg btn-outline-secondary">
                  {tag?.name}
                </button>
              </Link>
            ))
          ) : (
            <div className="text-center w-100">
              <h2>در حال بارگذاری...</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}