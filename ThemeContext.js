// Modo escuro
import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const theme = {
    darkMode,
    colors: darkMode
      ? {
          background: "#121212",
          card: "#1E1E1E",
          text: "#FFFFFF",
          contrast: "#f5dd4b",
        }
      : {
          background: "#e9e9ebff",
          card: "#5b133aff",
          text: "#000000",
          contrast: "#780b47",
        },
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
