import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/ts/app.tsx"],
      ssr: "resources/ts/ssr.tsx",
      refresh: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": "/resources/ts",
    },
  },
});
