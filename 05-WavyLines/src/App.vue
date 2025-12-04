<template>
  <div class="app-container">
    <WavyLines />
    <div class="app-info">
      <h1>Interactive Wavy Lines</h1>
      <p>Move your mouse to interact with the waves</p>
    </div>
  </div>
</template>

<script setup>
import WavyLines from './components/WavyLines.vue'
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.app-info {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10;
  color: #171717;
  pointer-events: none;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

p {
  font-size: 1rem;
  opacity: 0.7;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .app-info {
    top: 1rem;
    left: 1rem;
  }
  
  h1 {
    font-size: 1.8rem;
  }
}
</style>
