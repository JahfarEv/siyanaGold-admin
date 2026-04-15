import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: ["icon-192.png", "icon-512.png"],

      manifest: {
        name: "Siyana Gold Admin",
        short_name: "Siyana",
        description: "Admin panel for managing jewelry products",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#f59e0b",
        orientation: "portrait",
        scope: "/",

        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }
    })
  ],
});