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
      open: process.env.ANALYZE === "true",
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
    }),
  ],
});
