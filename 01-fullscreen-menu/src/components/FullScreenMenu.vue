<template>
  <div
    id="toggleIcon"
    @click="menuToggle"
    :class="{ active: isActive }"
  >
    <span></span>
  </div>

  <!-- 菜单覆盖层 -->
  <div id="menu-overlay" :class="{ active: isActive }">
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Services</a></li>
      <li><a href="#">Portfolio</a></li>
      <li><a href="#">Our Team</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 控制菜单+图标的响应式变量（复用同一个变量）
const isActive = ref(false)

// 切换方法：同时控制菜单和图标的状态
const menuToggle = () => {
  isActive.value = !isActive.value
}
</script>

<style scoped>
/* 导入谷歌字体 */
@import url('https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap');

/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
}

/* 菜单覆盖层样式 */
#menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #6D28D9;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  opacity: 0;
  visibility: hidden;
  transform: scale(0);
  transition: 0.6s;
}

#menu-overlay.active {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
}

/* 菜单列表样式 */
#menu-overlay ul li {
  list-style: none;
  text-align: center;
  margin: 10px 0;
}

#menu-overlay ul li a {
  text-decoration: none;
  font-size: 3.5em;
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
}

#menu-overlay ul li a::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 8px;
  background: #F97316;
  transform: translateY(-50%) scaleX(0);
  transform-origin: right;
  transition: 0.5s transform;
}

#menu-overlay ul li a:hover::before {
  transform: translateY(-50%) scaleX(1);
  transform-origin: left;
}

/* 图标按钮样式*/
#toggleIcon {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: #F97316 url(/hamburger-menu-icon.png);
  background-size: 30px 30px; 
  background-position: center; /* 图标在方块内居中 */
  background-repeat: no-repeat; /* 防止图标重复 */
  z-index: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 图标按钮 active 状态 */
#toggleIcon.active {
  background: #F97316 url(/close-icon.png);
  background-size: 40px 40px; 
  background-position: center; 
  background-repeat: no-repeat; 
}
</style>
