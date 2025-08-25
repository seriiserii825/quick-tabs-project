// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

export default defineConfig({
  base: "./",                 // 👈 ensures built asset URLs are relative
  plugins: [vue(), crx({ manifest })],
});
