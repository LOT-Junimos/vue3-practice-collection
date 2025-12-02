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

<script>
export default {
  name: 'FaultEffect',
  data() {
    return {
      displayText: '404 NOT FOUND',
      isFaulting: false,
      faultTimer: null,
      resetTimer: null,
      textCount: 4,
      textPositions: []
    }
  },
  computed: {
    texts() {
      return Array(this.textCount).fill(0).map((_, i) => i);
    }
  },
  mounted() {
    this.initializeTextPositions();
  },
  beforeUnmount() {
    this.clearTimers();
  },
  methods: {
    initializeTextPositions() {
      this.textPositions = this.texts.map(() => ({
        translateX: 0,
        translateY: 0,
        clipPath: ''
      }));
    },
    
    triggerFault() {
      this.clearTimers();
      this.isFaulting = true;
      
      this.updateFaultPositions();
      
      this.faultTimer = setInterval(() => {
        this.updateFaultPositions();
      }, 30);
      
      this.resetTimer = setTimeout(() => {
        this.resetFault();
      }, 1000);
    },
    
    updateFaultPositions() {
      this.textPositions = this.textPositions.map(() => ({
        translateX: Math.random() * 60 - 30,
        translateY: Math.random() * 60 - 30,
        clipPath: this.generateRandomClipPath()
      }));
    },
    
    generateRandomClipPath() {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const w = Math.random() * 40 + 10;
      const h = Math.random() * 50 + 50;
      
      return `polygon(${x}% ${y}%, ${x + w}% ${y}%, ${x + w}% ${y + h}%, ${x}% ${y + h}%)`;
    },
    
    getTextStyle(index) {
      const position = this.textPositions[index];
      if (!position || !this.isFaulting) {
        return {};
      }
      
      return {
        transform: `translate(${position.translateX}%, ${position.translateY}%)`,
        clipPath: position.clipPath
      };
    },
    
    resetFault() {
      this.clearTimers();
      this.isFaulting = false;
      this.initializeTextPositions();
    },
    
    clearTimers() {
      if (this.faultTimer) {
        clearInterval(this.faultTimer);
        this.faultTimer = null;
      }
      
      if (this.resetTimer) {
        clearTimeout(this.resetTimer);
        this.resetTimer = null;
      }
    }
  }
}
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
  font-size: 8rem;
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
    font-size: 5.5rem;
  }
}

@media (max-width: 480px) {
  .faulttext {
    font-size: 4.5rem;
    letter-spacing: 0.3rem;
  }
}
</style>
