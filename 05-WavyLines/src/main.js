import { createApp } from 'vue'
import App from './App.vue'

// 创建Vue应用并挂载
const app = createApp(App)
app.mount('#app')

// 适配窗口大小变化
window.addEventListener('resize', () => {
  app.config.globalProperties.$emit('resize')
})
