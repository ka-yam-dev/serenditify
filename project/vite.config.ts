/// <reference types="vite/client" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  define: {
    "import.meta.env.VITE_SPOTIFY_CLIENT_ID": JSON.stringify(
      process.env.VITE_SPOTIFY_CLIENT_ID || "24df0f6abea64b2c8671922b0489324a"
    ),
    "import.meta.env.VITE_REDIRECT_URI": JSON.stringify(
      process.env.VITE_REDIRECT_URI ||
        "https://lighthearted-alfajores-1e4fa2.netlify.app/callback"
    ),
  },
});
