import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React ecosystem
          if (
            id.includes("react") ||
            id.includes("react-dom") ||
            id.includes("scheduler")
          ) {
            return "react";
          }

          // Routing
          if (id.includes("react-router")) {
            return "router";
          }

          // Material UI
          if (
            id.includes("@mui") ||
            id.includes("@emotion")
          ) {
            return "mui";
          }

          // Charts
          if (id.includes("recharts")) {
            return "charts";
          }

          // Calendar
          if (id.includes("react-calendar")) {
            return "calendar";
          }

          // Animation
          if (id.includes("framer-motion")) {
            return "motion";
          }

          // PDF Generation
          if (
            id.includes("jspdf") ||
            id.includes("html2canvas")
          ) {
            return "pdf";
          }

          // DOMPurify
          if (id.includes("dompurify")) {
            return "purify";
          }
        },
      },
    },
  },
});