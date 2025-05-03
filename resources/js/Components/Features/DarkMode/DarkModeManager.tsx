import React, { useEffect } from "react";
import { useDarkMode } from "../../../Stores/uiStore";

/**
 * This component syncs the dark mode state from Zustand with the HTML element's class list
 * to enable Tailwind's dark mode system to work with class strategy
 */
const DarkModeManager: React.FC = () => {
  const darkMode = useDarkMode();

  useEffect(() => {
    // Apply dark mode class to HTML for Tailwind dark mode when the darkMode state changes
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // This component doesn't render anything
  return null;
};

export default DarkModeManager;
