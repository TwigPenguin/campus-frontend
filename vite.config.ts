import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 后端同学的 Spring Boot 地址
        changeOrigin: true,
        // 注意：不需要 rewrite，因为后端路径本身就带 /api
      },
    },
  },
});
