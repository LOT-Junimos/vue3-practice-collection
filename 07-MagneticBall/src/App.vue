<template>
  <div id="app">
    <MagneticBall />
  </div>
</template>

<script setup>
import MagneticBall from './components/MagneticBall.vue'
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
}
</style>
