import "../css/app.css";
import "./bootstrap";
import "@ant-design/v5-patch-for-react-19";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";
import { ThemeProvider } from "./theme";
import { StyleProvider } from "@ant-design/cssinjs";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob("./Pages/**/*.tsx")
    ),
  setup({ el, App, props }) {
    // Wrap with StyleProvider for better styles rendering in React 19
    const AppWithTheme = () => (
      <StyleProvider hashPriority="high">
        <ThemeProvider>
          <App {...props} />
        </ThemeProvider>
      </StyleProvider>
    );

    if (import.meta.env.SSR) {
      // Use specific SSR-safe rendering for React 19
      hydrateRoot(el, <AppWithTheme />);
      return;
    }

    // Use React 19's improved createRoot API
    createRoot(el).render(<AppWithTheme />);
  },
  progress: {
    color: "#3b8cb7", // Using the primary brand color
  },
});
