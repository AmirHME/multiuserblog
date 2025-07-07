 // context/blog
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "@/context/theme";
import editorDarkCss from "@/utils/editorDarkCss";
const BlogContext = createContext();
export const BlogProvider = ({ children }) => {
const { theme } = useTheme();
const [title, setTitle] = useState("");
const [markdown, setMarkdown] = useState("");
useEffect(() => {
const customStyle = document.createElement("style");
customStyle.classList.add("editor-dark-theme"); // Add a class for
identification
customStyle.innerHTML = editorDarkCss;
const existingStyle = document.querySelector(".editor-dark-theme");
if (theme === "dark") {
if (!existingStyle) {
document.head.appendChild(customStyle);
}
} else {
if (existingStyle) {
document.head.removeChild(existingStyle);
}
}
}, [theme]);
// Load the content from local storage on component mount
useEffect(() => {
const savedTitle = localStorage.getItem("savedTitle");
const savedMarkdown = localStorage.getItem("savedMarkdown");
if (savedTitle && savedMarkdown) {
setTitle(savedTitle);

setMarkdown(savedMarkdown);
}
}, []);
// Save the content to local storage whenever it changes
useEffect(() => {
localStorage.setItem("savedTitle", title);
localStorage.setItem("savedMarkdown", markdown);
}, [title, markdown]);
return (
    <BlogContext.Provider
      value={{
        title,
        setTitle,
        markdown,
        setMarkdown,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext);