import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const port = process.env.PORT
  ? Number(process.env.PORT)
  : 3000;

export default defineConfig({
  plugins: [react()],

  server: {
    port,
    host: "0.0.0.0",
  },

  preview: {
    port,
    host: "0.0.0.0",
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
