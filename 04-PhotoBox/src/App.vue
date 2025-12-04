<template>
  <!-- 引入照片墙组件 -->
  <PhotoBox />
</template>

<script setup>
// 导入PhotoBox组件
import PhotoBox from './components/PhotoBox.vue'
</script>

<style scoped>
/* 全局基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #171717;
}
</style>
