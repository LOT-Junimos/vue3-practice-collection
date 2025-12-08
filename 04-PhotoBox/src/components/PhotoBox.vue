<template>
  <div class="photo-container">
    <div
      ref="photoContainer"
      class="photos"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @mouseleave="onMouseLeave"
      @mousemove="onMouseMove"
    >
      <div
        v-for="(row, rowIndex) in photoRows"
        :key="rowIndex"
        class="photos_line"
      >
        <div
          v-for="(photo, photoIndex) in row"
          :key="photoIndex"
          class="photos_line_photo"
          ref="photoElements"
        >
          <img
            :src="photo.src"
            :alt="`sweet-${rowIndex}-${photoIndex}`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

// 定义照片数据
const photoRows = [
  [
    { src: '/photos/sweet(1).png' },
    { src: '/photos/sweet(2).png' },
    { src: '/photos/sweet(3).png' },
    { src: '/photos/sweet(4).png' },
    { src: '/photos/sweet(5).png' },
    { src: '/photos/sweet(6).png' },
    { src: '/photos/sweet(7).png' }
  ],
  [
    { src: '/photos/sweet(8).png' },
    { src: '/photos/sweet(9).png' },
    { src: '/photos/sweet(10).png' },
    { src: '/photos/sweet(11).png' },
    { src: '/photos/sweet(12).png' },
    { src: '/photos/sweet(13).png' },
    { src: '/photos/sweet(14).png' }
  ],
  [
    { src: '/photos/sweet(15).png' },
    { src: '/photos/sweet(16).png' },
    { src: '/photos/sweet(17).png' },
    { src: '/photos/sweet(18).png' },
    { src: '/photos/sweet(19).png' },
    { src: '/photos/sweet(20).png' },
    { src: '/photos/sweet(21).png' }
  ],
  [
    { src: '/photos/sweet(22).png' },
    { src: '/photos/sweet(23).png' },
    { src: '/photos/sweet(24).png' },
    { src: '/photos/sweet(25).png' },
    { src: '/photos/sweet(26).png' },
    { src: '/photos/sweet(27).png' },
    { src: '/photos/sweet(28).png' }
  ]
]

// 响应式引用
const photoContainer = ref(null)
const photoElements = ref([])
const imgData = ref([])
const containerWidth = ref(0)
const containerHeight = ref(0)
const photoWidth = ref(0)
const photoHeight = ref(0)
const isMovable = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const standardWidth = 1440
const scaleNums = ref(1)

// 鼠标事件处理
const onMouseDown = (event) => {
  if (isMovable.value) return

  isMovable.value = true
  mouseX.value = event.clientX
  mouseY.value = event.clientY

  // 鼠标按下时画布缩小
  gsap.to(photoContainer.value, {
    scale: scaleNums.value * 0.95, // 缩小到原来的95%
    duration: 0.3,
    ease: 'power2.out'
  })
}

const onMouseUp = () => {
  isMovable.value = false

  // 鼠标释放时画布恢复原大小
  gsap.to(photoContainer.value, {
    scale: scaleNums.value,
    duration: 0.3,
    ease: 'power2.out'
  })
}

const onMouseLeave = () => {
  isMovable.value = false

  // 鼠标离开时画布也恢复原大小
  gsap.to(photoContainer.value, {
    scale: scaleNums.value,
    duration: 0.3,
    ease: 'power2.out'
  })
}

const onMouseMove = (event) => {
  if (!isMovable.value) return

  const distanceX = (event.clientX - mouseX.value) / scaleNums.value
  const distanceY = (event.clientY - mouseY.value) / scaleNums.value

  imgData.value.forEach((img) => {
    let duration = 1
    img.movX += distanceX

    // X轴无限循环
    if (img.x + img.movX > containerWidth.value) {
      img.movX -= containerWidth.value
      duration = 0
    }
    if (img.x + img.movX < -photoWidth.value) {
      img.movX += containerWidth.value
      duration = 0
    }

    img.movY += distanceY

    // Y轴无限循环
    if (img.y + img.movY > containerHeight.value) {
      img.movY -= containerHeight.value
      duration = 0
    }
    if (img.y + img.movY < -photoHeight.value) {
      img.movY += containerHeight.value
      duration = 0
    }

    // 应用动画
    if (img.ani) img.ani.kill()
    img.ani = gsap.to(img.node, {
      transform: `translate(${img.movX}px, ${img.movY}px)`,
      duration: duration,
      ease: 'power4.out'
    })
  })

  // 更新鼠标位置
  mouseX.value = event.clientX
  mouseY.value = event.clientY
}

// 调整尺寸和位置
const resize = () => {
  if (!photoContainer.value || photoElements.value.length === 0) return

  // 获取容器尺寸（移除导航栏高度相关计算）
  containerWidth.value = photoContainer.value.offsetWidth
  containerHeight.value = photoContainer.value.offsetHeight

  // 获取照片尺寸
  photoWidth.value = photoElements.value[0].offsetWidth
  photoHeight.value = photoElements.value[0].offsetHeight

  // 计算缩放比例
  scaleNums.value = document.body.offsetWidth / standardWidth

  // 应用缩放
  photoContainer.value.style.transform = `scale(${scaleNums.value})`

  // 重置所有照片位置
  gsap.to(photoElements.value, {
    transform: 'translate(0, 0)',
    duration: 0,
    ease: 'power4.out'
  })

  // 初始化照片数据
  imgData.value = photoElements.value.map(img => ({
    node: img,
    x: img.offsetLeft,
    y: img.offsetTop,
    movX: 0,
    movY: 0,
    ani: null
  }))
}

// 初始化
const init = () => {
  resize()
  window.addEventListener('resize', resize)
}

// 生命周期钩子
onMounted(() => {
  // 确保DOM已渲染完成
  setTimeout(() => {
    init()
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)

  // 清理动画
  imgData.value.forEach(img => {
    if (img.ani) img.ani.kill()
  })
})
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}

img {
  pointer-events: none;
  user-select: none;
}

/* 照片墙容器：移除导航栏后占满整个视口 */
.photo-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #171717;
  overflow: hidden;
  box-sizing: border-box;
}

.photos {
  position: absolute;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.photos_line {
  font-size: 1px;
  height: 342em;
  margin-bottom: 48em;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.photos_line_photo {
  font-size: 1px;
  width: 234em;
  height: 100%;
  margin-right: 36em;
  border-radius: 15em;
  background-color: #ac9ae8;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.photos_line_photo img {
  height: 100%;
  transition: 0.3s ease;
}

.photos_line_photo:hover img {
  transform: scale(1.2);
}

@media screen and (max-aspect-ratio: 1.5/1) {
  .photos_line,
  .photos_line_photo {
    font-size: 2px;
  }
}

@media screen and (max-aspect-ratio: 0.8/1) {
  .photos_line,
  .photos_line_photo {
    font-size: 2.8px;
  }
}
</style>
