import React, { createContext, useContext } from "react";

const ThemeContext = createContext();

const theme = {
  mode: "dark",
  colors: {
    background: "#0b1020",
    card: "rgba(255,255,255,0.05)",
    cyan: "#00e5ff",
    purple: "#8a5cff",
    text: "#ffffff"
  }
};

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
