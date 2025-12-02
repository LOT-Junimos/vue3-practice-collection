<template>
  <!-- 页面容器 -->
  <div class="app-container">
    <!-- 引入扑克牌轮播组件 -->
    <PokerCarousel />
  </div>
</template>

<script setup>
// 导入核心组件
import PokerCarousel from './components/PokerCarousel.vue';
</script>

<style scoped>
/* 基础样式重置 + 页面容器样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, .app-container {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app-container {
  background-color: #000; /* 与组件背景色一致，保证视觉统一 */
}
</style>
