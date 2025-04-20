import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

// Fakevest primary brand color - same as used in Ant Design theme
const primaryColor = "#3b8cb7";

module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.ts",
    "./resources/**/*.tsx",
  ],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      fontFamily: {
        sans: ["Figtree", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: primaryColor,
          50: "#f0f7fc",
          100: "#dcedf8",
          200: "#bfdeef",
          300: "#93c8e3",
          400: "#5fadd3",
          500: "#3b8cb7", // Primary brand color
          600: "#2c7599",
          700: "#265f7e",
          800: "#244f68",
          900: "#224558",
        },
        // We're keeping Tailwind's gray scale as is since it works well with AntD
      },
    },
  },
  plugins: [forms],
};
