import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

//vant config
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/global.scss";`,
      },
    },
  },
  server: {
    /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
    host: true, // host: "0.0.0.0"
    /** 端口号 */
    port: 8080,
    /** 是否自动打开浏览器 */
    open: true,
    /** 跨域设置允许 */
    cors: true,
    /** 端口被占用时，是否直接退出 */
    strictPort: false,
    /** 接口代理 */
    // proxy: {
    //   "/api": {
    //     target: "https://api.uunn.org",
    //     ws: false,
    //     /** 是否允许跨域 */
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
    /** 预热常用文件，提高初始页面加载速度 */
    // warmup: {
    //   clientFiles: ["./src/layouts/**/*.vue"],
    // },
  },
  /** 混淆器 */
  esbuild: {
    /** 打包时移除 console.log */
    pure: ["console.log"],
    /** 打包时移除 debugger */
    drop: ["debugger"],
    /** 打包时移除所有注释 */
    legalComments: "none",
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // 最小化拆分包
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
        // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
        entryFileNames: "js/[name].[hash].js",
        // 用于命名代码拆分时创建的共享块的输出命名
        // 　　chunkFileNames: 'js/[name].[hash].js',
        // 用于输出静态资源的命名，[ext]表示文件扩展名
        assetFileNames(assetInfo) {
          if (
            ["png", "jpg", "svg", "PNG", "webp"].some((ext) =>
              assetInfo.name.endsWith(ext)
            )
          ) {
            return "img/[name]-[hash].[ext]";
          } else {
            return "[ext]/[name].[hash].[ext]";
          }
        },
        // 拆分js到模块文件夹
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split("/")
            : [];
          const fileName =
            facadeModuleId[facadeModuleId.length - 2] || "[name]";
          return `js/${fileName}/[name].[hash].js`;
        },
      },
    },
  },
});
