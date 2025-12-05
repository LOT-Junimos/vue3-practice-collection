import { createApp } from 'vue'
import App from './App.vue'

// 创建并挂载应用
const app = createApp(App)
app.mount('#app')

// 可选：全局注册 Lenis/GSAP（如果需要）
// import Lenis from 'lenis'
// window.lenis = new Lenis() // 暴露到全局，方便调试
