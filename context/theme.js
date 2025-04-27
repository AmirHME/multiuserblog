"use client";
import { createContext , useContext , useState , useEffect } from "react";

const ThemeContext = createContext();

const getDefaultTheme = () => {
    if(typeof window !== "undefined"){
        try {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme || "light";
        } catch (error) {
            console.error("Error accessing localStorage:", error);
            return "light";
        }
    }
    return "light"
};


//for layout.js
export const ThemeProvider = ({children}) => {
    const [theme , setTheme] = useState(getDefaultTheme());

        useEffect(() => {
            try {
            document.documentElement.setAttribute("data-bs-theme" , theme);
                document.body.setAttribute("data-bs-theme" , theme);
                document.body.className = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
            localStorage.setItem("theme" , theme); 
//save theme preference
            } catch (error) {
                console.error("Error setting theme:", error);
            }
        }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            return newTheme;
        });
    };
    return <ThemeContext.Provider value={{theme , toggleTheme}}>
        {children}
        </ThemeContext.Provider>
};
    

//for بغ.js
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
