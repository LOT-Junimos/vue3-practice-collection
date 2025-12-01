<template>
  <div class="poker-container">
    <div class="container">
      <!-- 扑克牌列表 -->
      <div
        v-for="(item, index) in pokerList"
        :key="index"
        class="poker"
        :style="{
          transform: transformDatas[item.nums],
          zIndex: item.nums,
          transition: item.isTransition ? 'transform 0.3s ease' : ''
        }"
      >
        <img :src="item.imgSrc" alt="poker" />
      </div>
      <!-- 顶部点击层 -->
      <div
        class="poker_top poker5"
        @click="move"
        :style="{
          transform: transformDatas[4],
          zIndex: 1000
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 加日志，确认组件挂载
onMounted(() => {
  console.log('扑克牌组件已挂载！');
  init();
});

// 扑克牌位置变换数据
const transformDatas = ref([
  "rotate(-10deg)",
  "rotate(-6deg) translate(35%, -12%)",
  "rotate(-2deg) translate(65%, -19%)",
  "rotate(2deg) translate(95%, -26%)",
  "rotate(6deg) translate(125%, -23%)",
]);

// 图片列表（预加载）
const imgs = ref([]);
// 扑克牌列表数据
const pokerList = ref([]);
// 当前图片索引
const imgIndex = ref(0);

// 初始化扑克牌数据
const init = () => {
  // 预加载所有图片
  for (let i = 0; i < 10; i++) {
    const img = new Image();
    img.src = `/photos/photo (${i}).webp`; // 注意：Vue 中静态资源建议放在 public 目录下
    imgs.value.push(img);
  }

  // 初始化5张扑克牌基础数据
  const initCount = 5;
  pokerList.value = Array.from({ length: initCount }, (_, index) => ({
    nums: index,
    imgSrc: imgs.value[index].src,
    isTransition: false
  }));

  // 初始化图片索引为扑克牌数量
  imgIndex.value = initCount;
};

// 移动扑克牌逻辑
const move = () => {
  pokerList.value = pokerList.value.map(ele => {
    let nums = ele.nums;
    let isTransition = true;
    let imgSrc = ele.imgSrc;

    // 最后一张牌的特殊处理
    if (nums + 1 >= pokerList.value.length) {
      nums = 0;
      isTransition = false;
      // 更新图片
      imgSrc = imgs.value[imgIndex.value].src;
      // 更新图片索引
      imgIndex.value = (imgIndex.value + 1) % imgs.value.length;
    } else {
      nums += 1;
    }

    return {
      ...ele,
      nums,
      imgSrc,
      isTransition
    };
  });
};

// 组件挂载后初始化
onMounted(() => {
  init();
});
</script>

<style scoped>
/* 重置样式 */
.poker-container :deep(*) {
  font-size: 2vmin;
  margin: 0;
  padding: 0;
}

.poker-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
}

.container {
  position: absolute;
  width: 45rem;
  height: 25rem;
  margin-bottom: 1rem;
}

.poker,
.poker_top {
  position: absolute;
  width: 20rem;
  height: 26rem;
  border: 0.15rem solid #fff;
  border-radius: 1.5rem;
  background-color: #17f700;
  transform-origin: bottom left;
  overflow: hidden;
  user-select: none;
}

.poker img {
  position: relative;
  width: 100%;
}

.poker_top {
  background-color: #fff;
  transition: 0.3s ease;
  cursor: pointer;
}

.poker_top:hover {
  background-color: #aaa;
}
</style>
