// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    css: {
      preprocessorOptions: {
        css: {
          additionalData: `@import "./src/styles/main.css";`
        }
      }
    }
  }
});