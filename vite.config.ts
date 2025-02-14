// tsconfig.json
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
  esbuild: {
    drop: ['console', 'debugger'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            // Chunk large libraries
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            if (id.includes("react-router-dom")) {
              return "vendor-react-router";
            }
            if (id.includes("lucide-react")) {
              return "vendor-lucide";
            }
            if (id.includes("sonner")) {
              return "vendor-sonner";
            }
            if (id.includes("react-syntax-highlighter")) {
              return "vendor-syntax-highlighter";
            }

            // Chunk Radix UI components
            if (id.includes("@radix-ui")) {
              return "vendor-radix";
            }

            // Chunk utility libraries
            if (
              id.includes("class-variance-authority") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge")
            ) {
              return "vendor-utils";
            }

            // Chunk other dependencies
            if (id.includes("idb")) {
              return "vendor-idb";
            }
            if (id.includes("next-themes")) {
              return "vendor-themes";
            }
            if (id.includes("cmdk")) {
              return "vendor-cmdk";
            }

            // Default vendor chunk for other node_modules
            return "vendor";
          }

          // Chunk your own code
          if (id.includes("src/components")) {
            return "components";
          }
          if (id.includes("src/utils")) {
            return "utils";
          }

          // Default chunk for the rest
          return null;
        },
      },
    },
  },
})