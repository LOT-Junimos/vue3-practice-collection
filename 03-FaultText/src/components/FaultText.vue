<template>
  <div class="fault-effect-app">
    <div class="container" @click="triggerFault">
      <p 
        v-for="(text, index) in texts" 
        :key="index" 
        class="faulttext" 
        :class="{ 'faulttext_fault': isFaulting }"
        :style="getTextStyle(index)"
        :data-text="displayText"
      >
        {{ displayText }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

// 配置项
const displayText = ref('404 NOT FOUND'); // 显示文字
const textCount = ref(4); // 文字层数量
const isFaulting = ref(false); // 是否触发故障效果
// 定时器
let faultTimer = null;
let resetTimer = null;
// 存储每个文本的位置/裁剪样式
const textPositions = ref([]);

// 生成文本列表
const texts = computed(() => Array(textCount.value).fill(0).map((_, i) => i));

// 初始化文本位置
const initializeTextPositions = () => {
  textPositions.value = texts.value.map(() => ({
    translateX: 0,
    translateY: 0,
    clipPath: ''
  }));
};

// 生成随机裁剪路径
const generateRandomClipPath = () => {
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const w = Math.random() * 40 + 10;
  const h = Math.random() * 50 + 50;
  return `polygon(${x}% ${y}%, ${x + w}% ${y}%, ${x + w}% ${y + h}%, ${x}% ${y + h}%)`;
};

// 更新故障位置样式
const updateFaultPositions = () => {
  textPositions.value = textPositions.value.map(() => ({
    translateX: Math.random() * 60 - 30,
    translateY: Math.random() * 60 - 30,
    clipPath: generateRandomClipPath()
  }));
};

// 获取单个文本样式
const getTextStyle = (index) => {
  const position = textPositions.value[index];
  if (!position || !isFaulting.value) return {};
  return {
    transform: `translate(${position.translateX}%, ${position.translateY}%)`,
    clipPath: position.clipPath
  };
};

// 清除所有定时器
const clearTimers = () => {
  if (faultTimer) clearInterval(faultTimer);
  if (resetTimer) clearTimeout(resetTimer);
  faultTimer = null;
  resetTimer = null;
};

// 重置故障效果
const resetFault = () => {
  clearTimers();
  isFaulting.value = false;
  initializeTextPositions();
};

// 触发故障效果
const triggerFault = () => {
  clearTimers();
  isFaulting.value = true;
  
  updateFaultPositions();
  faultTimer = setInterval(updateFaultPositions, 30);
  resetTimer = setTimeout(resetFault, 1000);
};

// 初始化 & 组件卸载清理
initializeTextPositions();
onUnmounted(clearTimers);
</script>

<style scoped>
* {
  font-size: 2vmin;
  margin: 0;
  padding: 0;
}

.fault-effect-app {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #000;
  overflow: hidden;
}

.container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.faulttext {
  position: absolute;
  font-family: Impact, sans-serif;
  font-size: 9rem;
  color: #fff;
  letter-spacing: 0.5rem;
  user-select: none;
}

.faulttext_fault::after,
.faulttext_fault::before {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  mix-blend-mode: screen;
}

.faulttext_fault::after {
  color: #ff0000;
  transform: translateX(2%);
}

.faulttext_fault::before {
  color: #0000ff;
  transform: translateX(-2%);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .faulttext {
    font-size: 6.5rem;
  }
}

@media (max-width: 480px) {
  .faulttext {
    font-size: 5.5rem;
    letter-spacing: 0.3rem;
  }
}
</style>
