<template>
  <div class="empty">KEEP SCROLL</div>
  <div class="empty">KEEP SCROLL</div>
  <div class="wapper">
    <div class="container">
      <div class="cardsbox">
        <div class="cardsbox_card">
          <img src="/photos/xlg(1).jpg" alt="Image 1" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="cardsbox_card">
          <img src="/photos/xlg(2).jpg" alt="Image 2" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="cardsbox_card">
          <img src="/photos/xlg(3).jpg" alt="Image 3" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="cardsbox_card">
          <img src="/photos/xlg(4).jpg" alt="Image 4" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      </div>
    </div>
  </div>
  <div class="empty">KEEP SCROLL</div>
  <div class="empty">KEEP SCROLL</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

// 初始化Lenis滚动
const lenis = new Lenis({
  duration: 1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  autoRaf: true,
});

// 定义滚动容器对象
const scrollbox = {
  wapper: null,
  cardsbox: null,
  distance: 0,
  if_leave: false,
  init() {
    this.wapper = document.querySelector(".wapper");
    this.cardsbox = document.querySelector(".cardsbox");
    this.resize();
    window.addEventListener("resize", this.resize.bind(this));
    this.create_scrolltrigger();
  },
  create_scrolltrigger() {
    ScrollTrigger.create({
      trigger: this.wapper,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        this.cardsbox.style.transform = `translateX(-${self.progress * this.distance}px)`;
      },
      onLeave: () => {
        this.if_leave = true;
      },
      onEnterBack: () => {
        this.if_leave = false;
      }
    });
  },
  resize() {
    this.distance = this.cardsbox.offsetWidth - innerWidth;
    this.wapper.style.height = `${this.distance}px`;
    if (this.if_leave) this.cardsbox.style.transform = `translateX(-${this.distance}px)`;
  }
};

// 在组件挂载时初始化
onMounted(() => {
  scrollbox.init();
});

// 在组件卸载时清理
onUnmounted(() => {
  window.removeEventListener("resize", scrollbox.resize.bind(scrollbox));
  // 清理ScrollTrigger实例
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  font-size: 1vmin;
}

/* 不再设置全局body背景色，只设置组件内需要的样式 */

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80rem;
  margin: 10rem 0;
  background-color: #f7f7f7;
  font-family: impact;
  font-size: 5rem;
  color: #171717;
}

.wapper {
  position: relative;
  width: 100%;
}

.container {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #9a7ced;
  overflow: hidden;
}

.cardsbox {
  display: flex;
}

.cardsbox_card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70rem;
  height: 50rem;
  background-color: #f7f7f7;
  margin-right: 50rem;
  font-family: impact;
  font-size: 5rem;
  color: #171717;
  flex-shrink: 0;
}
</style>
