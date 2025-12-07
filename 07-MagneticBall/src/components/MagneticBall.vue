<template>
    <div class="magnetic-ball-container">
        <svg class="container" ref="containerRef"></svg>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

// 1. 定义容器ref（和模板里的svg ref对应）
const containerRef = ref(null)
// 2. 声明全局的事件处理器（用于卸载时移除）
let mouseMoveHandler = null
// 3. 声明magnetic对象（避免作用域丢失）
let magnetic = null

// 4. 核心：修复后的完整逻辑
function initMagneticBall() {
  if (!containerRef.value) return

  magnetic = {
    container: containerRef.value, // 绑定SVG容器DOM
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    lines: 10, // 列数
    rows: 10,  // 行数
    balls: [], // 存储小球数组
    mouse_radius: 150, // 鼠标感应半径
    // 初始化尺寸和事件
    init() {
      this.resize()
      this.create_yoyo(18) // 调用内部的create_yoyo
      // 全局鼠标移动事件（绑定到document）
      mouseMoveHandler = (e) => {
        this.move_balls(e.x, e.y)
      }
      document.addEventListener('mousemove', mouseMoveHandler)
    },
    // 尺寸适配
    resize() {
      const rect = this.container.getBoundingClientRect()
      // 新写法：直接取SVG的宽高（对应样式里的50rem）
      this.width = parseFloat(this.container.getAttribute('width')) || this.container.clientWidth;
      this.height = parseFloat(this.container.getAttribute('height')) || this.container.clientHeight;
      this.left = rect.left
      this.top = rect.top
    },
    // 创建小球和线条（核心修复：放在magnetic对象内部）
    create_yoyo(radius) {
      // 清空旧元素，避免重复创建
      this.balls = []
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild)
      }

      for (let r = 0; r <= this.rows; r++) {
        for (let l = 0; l <= this.lines; l++) {
          const x = this.width / this.lines * l
          const y = this.height / this.rows * r

          // 创建外层小球
          const ball = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          ball.setAttribute('fill', '#6D28D9')
          ball.setAttribute('cx', x)
          ball.setAttribute('cy', y)
          ball.setAttribute('r', radius)

          // 创建中心小白点
          const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          point.setAttribute('fill', '#f7f7f7')
          point.setAttribute('cx', x)
          point.setAttribute('cy', y)
          point.setAttribute('r', radius / 5)

          // 创建线条
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
          line.setAttribute('x1', x)
          line.setAttribute('y1', y)
          line.setAttribute('x2', x)
          line.setAttribute('y2', y)
          line.setAttribute('stroke', '#ffffff')
          line.setAttribute('stroke-width', '2')//粗细
          line.setAttribute('stroke-opacity', '0.3')//线条深浅

          // 添加到容器
          this.container.appendChild(line)
          this.container.appendChild(point)
          this.container.appendChild(ball)

          // 绑定关联属性
          ball.line = line
          ball.ori_x = x
          ball.ori_y = y
          this.balls.push(ball)
        }
      }
    },
    // 鼠标移动时小球动画逻辑
    move_balls(x, y) {
      this.balls.forEach(ball => {
        const mouse_x = x - this.left
        const mouse_y = y - this.top
        const dx = ball.ori_x - mouse_x
        const dy = ball.ori_y - mouse_y
        const distance = Math.sqrt(dx ** 2 + dy ** 2)

        if (distance <= this.mouse_radius) {
          // 此「磁力强度系数」可控制小球移动距离
           const magneticStrength = -0.4; // 可正可负哦~
          
           ball.move_x = ball.ori_x - dx * magneticStrength;
           ball.move_y = ball.ori_y - dy * magneticStrength;

          // 停止旧动画，创建新动画
          if (ball.animater) ball.animater.kill()
          ball.animater = gsap.timeline()
            .to(ball, {
              attr: { cx: ball.move_x, cy: ball.move_y },
              duration: 0.5,
              ease: "power3.out"
            })
            .to(ball.line, {
              attr: { x2: ball.move_x, y2: ball.move_y },
              duration: 0.5,
              ease: "power3.out"
            }, "<") // 与上一动画同时开始
            .to(ball, {
              attr: { cx: ball.ori_x, cy: ball.ori_y },
              duration: 1,
              ease: "power3.out"
            }, "<0.1") // 延迟0.1秒开始
            .to(ball.line, {
              attr: { x2: ball.ori_x, y2: ball.ori_y },
              duration: 1,
              ease: "power3.out"
            }, "<")
        }
      })
    }
  }

  // 初始化磁球效果
  magnetic.init()
}

// 5. 组件挂载时初始化
onMounted(() => {
  initMagneticBall()
})

// 6. 组件卸载时清理（防止内存泄漏）
onUnmounted(() => {
  // 移除鼠标事件
  if (mouseMoveHandler) {
    document.removeEventListener('mousemove', mouseMoveHandler)
  }
  // 停止所有gsap动画
  gsap.killTweensOf('circle, line')
  // 清空容器
  if (containerRef.value) {
    while (containerRef.value.firstChild) {
      containerRef.value.removeChild(containerRef.value.firstChild)
    }
  }
})
</script>

<style scoped>
.magnetic-ball-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #171717;
  margin: 0;
  padding: 0;
  font-size: 1vmin;
  /* 加这行：让子元素absolute基于这个容器定位 */
  position: relative; 
  overflow: hidden; /* 防止超出视口 */
}

.container {
  position: absolute;
  width: 35rem;
  height: 35rem;
  overflow: visible;
  /* 加这行：确保SVG的坐标计算基于自身宽高 */
  transform-origin: center center; 
  /* 可选：整体缩小的话加scale，比如缩到80% */
  /* transform: scale(0.8); */
}

.container line {
  fill: none;
  stroke: #f7f7f7;
  stroke-width: 2;
  stroke-opacity: 0.8; 
}

/* 小球样式（可选：统一样式） */
.container circle {
  stroke: none; /* 去掉默认描边 */
}
</style>
