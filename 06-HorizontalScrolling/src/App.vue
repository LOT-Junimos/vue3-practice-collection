<template>
  <div class="app-container">
    <!-- 水平滚动图片组件 -->
    <HorizontalScrolling />
  </div>
</template>

<script setup>
// 导入组件
import HorizontalScrolling from './components/HorizontalScrolling.vue'
</script>

<style scoped>
/* 根容器样式，可根据需要调整 */
.app-container {
  width: 100%;
  min-height: 100vh;
}
</style>
