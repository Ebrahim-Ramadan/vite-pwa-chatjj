import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
// @ts-ignore
import tailwindcss from "@tailwindcss/vite";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";


const manifestForPlugin: Partial<VitePWAOptions> = {
  devOptions: {
    enabled: true
  },
  registerType: "prompt",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  manifest: {
    name: "chatjj",
    short_name: "chatjj",
    description: "talk to your local deepseek",
    icons: [
      // {
      //   src: "/android-chrome-192x192.png",
      //   sizes: "192x192",
      //   type: "image/png",
      // },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      // {
      //   src: "/apple-touch-icon.png",
      //   sizes: "180x180",
      //   type: "image/png",
      //   purpose: "apple touch icon",
      // },
      // {
      //   src: "/icon.png",
      //   sizes: "225x225",
      //   type: "image/png",
      //   purpose: "any maskable",
      // },
    ],
    theme_color: "#171717",
    background_color: "#18181B",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA(manifestForPlugin), 
    // eslintPlugin({
    //   exclude: ['**/*.ts', '**/*.tsx']
    // })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})