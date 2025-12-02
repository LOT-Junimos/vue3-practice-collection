import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()], // Vue 3 插件
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 路径别名
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue']
        }
      }
    }
  },
  preview: {
    port: 4173,
    open: true
  }
})
