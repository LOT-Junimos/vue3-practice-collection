import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src') // 配置 src 目录别名（可选）
    }
  },
  base: './', // 适配静态资源路径，确保部署后图片能加载
  build: {
    outDir: 'dist', // 构建输出目录（Vercel 默认识别 dist）
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          // 拆分依赖包，优化构建体积
          gsap: ['gsap'],
          lenis: ['lenis']
        }
      }
    }
  }
})
