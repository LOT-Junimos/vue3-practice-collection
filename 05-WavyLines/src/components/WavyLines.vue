<template>
  <div class="waves-container" ref="container">
    <svg ref="svg"></svg>
  </div>
</template>

<script>
export default {
  name: 'AWaves',
  data() {
    return {
      svg: null,
      mouse: {
        x: 0,
        y: 0,
        lx: 0,
        ly: 0,
        sx: 0,
        sy: 0,
        v: 0,
        vs: 0,
        a: 0,
      },
      lines: [],
      paths: [],
      bounding: null,
      animationFrame: null,
      isAnimating: false,
      // 添加时间变量用于波动动画
      time: 0
    }
  },
  mounted() {
    this.init()
  },
  beforeUnmount() {
    this.cleanup()
  },
  methods: {
    init() {
      this.svg = this.$refs.svg
      this.bindEvents()
      this.setSize()
      this.setLines()
      this.startAnimation()
    },
    cleanup() {
      this.isAnimating = false
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame)
      }
    },
    bindEvents() {
      window.addEventListener('resize', this.handleResize)
      this.$refs.container.addEventListener('mousemove', this.handleMouseMove)
      this.$refs.container.addEventListener('touchmove', this.handleTouchMove, { passive: false })
      this.$refs.container.addEventListener('mouseleave', this.handleMouseLeave)
    },
    handleResize() {
      this.setSize()
      this.setLines()
    },
    handleMouseMove(e) {
      const rect = this.$refs.container.getBoundingClientRect()
      this.updateMousePosition(e.clientX - rect.left, e.clientY - rect.top)
    },
    handleMouseLeave() {
      this.mouse.x = -1000
      this.mouse.y = -1000
    },
    handleTouchMove(e) {
      e.preventDefault()
      const rect = this.$refs.container.getBoundingClientRect()
      this.updateMousePosition(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top)
    },
    setSize() {
      this.bounding = this.$refs.container.getBoundingClientRect()
      this.svg.setAttribute('width', this.bounding.width)
      this.svg.setAttribute('height', this.bounding.height)
    },
    setLines() {
      const { width, height } = this.bounding

      // 清空现有内容
      while (this.svg.firstChild) {
        this.svg.removeChild(this.svg.firstChild)
      }

      this.lines = []
      this.paths = []

      const xGap = 10
      const yGap = 32

      const oWidth = width + 200
      const oHeight = height + 30

      const totalLines = Math.ceil(oWidth / xGap)
      const totalPoints = Math.ceil(oHeight / yGap)

      const xStart = (width - xGap * totalLines) / 2
      const yStart = (height - yGap * totalPoints) / 2

      // 创建线条
      for (let i = 0; i <= totalLines; i++) {
        const points = []
        for (let j = 0; j <= totalPoints; j++) {
          const point = {
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
            ox: xStart + xGap * i,
            oy: yStart + yGap * j
          }
          points.push(point)
        }
        this.lines.push(points)

        // 创建路径元素
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('fill', 'none')
        path.setAttribute('stroke', '#171717')
        path.setAttribute('stroke-width', '1')
        path.setAttribute('stroke-linecap', 'round')
        path.setAttribute('stroke-linejoin', 'round')

        this.svg.appendChild(path)
        this.paths.push(path)
      }
    },
    updateMousePosition(x, y) {
      this.mouse.x = x
      this.mouse.y = y
    },
    startAnimation() {
      this.isAnimating = true
      this.animate()
    },
    animate() {
      if (!this.isAnimating) return

      this.time += 0.01

      // 更新鼠标平滑位置
      this.mouse.sx += (this.mouse.x - this.mouse.sx) * 0.1
      this.mouse.sy += (this.mouse.y - this.mouse.sy) * 0.1

      // 计算鼠标速度
      const dx = this.mouse.x - this.mouse.lx
      const dy = this.mouse.y - this.mouse.ly
      const d = Math.hypot(dx, dy)

      this.mouse.v = d
      this.mouse.vs += (d - this.mouse.vs) * 0.1
      this.mouse.vs = Math.min(100, this.mouse.vs)

      this.mouse.lx = this.mouse.x
      this.mouse.ly = this.mouse.y

      if (d > 0) {
        this.mouse.a = Math.atan2(dy, dx)
      }

      // 移动点
      this.movePoints()

      // 绘制平滑曲线
      this.drawSmoothLines()

      this.animationFrame = requestAnimationFrame(this.animate)
    },
    movePoints() {
      const { lines, mouse, time } = this

      lines.forEach((points) => {
        points.forEach((p, index) => {
          const dx = p.ox - mouse.sx
          const dy = p.oy - mouse.sy
          const distance = Math.sqrt(dx * dx + dy * dy)
          const effectRadius = Math.max(150, mouse.vs * 2)

          // 鼠标交互力
          let forceX = 0
          let forceY = 0

          if (distance < effectRadius && distance > 0) {
            const force = 1 - distance / effectRadius
            const angle = Math.atan2(dy, dx)

            forceX = Math.cos(angle) * force * mouse.vs * 0.06
            forceY = Math.sin(angle) * force * mouse.vs * 0.06
          }

          // 添加自然波动
          const waveStrength = 1.5
          const baseWave = Math.sin(p.ox * 0.01 + p.oy * 0.01 + time) * waveStrength
          const detailWave = Math.sin(p.ox * 0.03 + p.oy * 0.03 + time * 1.5) * waveStrength * 0.3

          p.cursor.vx += forceX + baseWave * 0.05 + detailWave * 0.02
          p.cursor.vy += forceY + baseWave * 0.05 + detailWave * 0.02

          // 弹性回归
          p.cursor.vx += (0 - p.cursor.x) * 0.01
          p.cursor.vy += (0 - p.cursor.y) * 0.01

          // 阻尼
          p.cursor.vx *= 0.93
          p.cursor.vy *= 0.93

          // 更新位置
          p.cursor.x += p.cursor.vx
          p.cursor.y += p.cursor.vy

          // 限制范围
          p.cursor.x = Math.max(-30, Math.min(30, p.cursor.x))
          p.cursor.y = Math.max(-30, Math.min(30, p.cursor.y))
        })
      })
    },
    // 使用Catmull-Rom样条曲线实现平滑连接
    drawSmoothLines() {
      const { lines, paths } = this

      lines.forEach((points, lineIndex) => {
        if (points.length < 2) return

        let pathData = ''

        // 遍历所有点，生成平滑曲线
        for (let i = 0; i < points.length; i++) {
          const p = points[i]
          const x = p.ox + p.cursor.x
          const y = p.oy + p.cursor.y

          if (i === 0) {
            // 第一个点使用 M 命令
            pathData = `M ${x} ${y}`
          } else {
            // 之前的点用于计算控制点
            const prevP = points[i - 1]
            const prevX = prevP.ox + prevP.cursor.x
            const prevY = prevP.oy + prevP.cursor.y

            if (i === 1) {
              // 第二个点，使用直线连接（后面会用曲线替换）
              pathData += ` L ${x} ${y}`
            } else {
              // 第三个及以后的点，使用二次贝塞尔曲线平滑连接
              const prevPrevP = points[i - 2]
              const prevPrevX = prevPrevP.ox + prevPrevP.cursor.x
              const prevPrevY = prevPrevP.oy + prevPrevP.cursor.y

              // 计算控制点（前后点的中间点）
              const cp1x = prevPrevX + (prevX - prevPrevX) * 0.5
              const cp1y = prevPrevY + (prevY - prevPrevY) * 0.5
              const cp2x = prevX + (x - prevX) * 0.5
              const cp2y = prevY + (y - prevY) * 0.5

              // 使用C命令（三次贝塞尔曲线）实现更平滑的连接
              pathData += ` C ${cp1x} ${cp1y}, ${prevX} ${prevY}, ${prevX} ${prevY}`
            }
          }
        }

        // 最后连接最后一个点
        if (points.length > 2) {
          const lastP = points[points.length - 1]
          const lastX = lastP.ox + lastP.cursor.x
          const lastY = lastP.oy + lastP.cursor.y

          const prevP = points[points.length - 2]
          const prevX = prevP.ox + prevP.cursor.x
          const prevY = prevP.oy + prevP.cursor.y

          pathData += ` L ${lastX} ${lastY}`
        }

        if (paths[lineIndex]) {
          paths[lineIndex].setAttribute('d', pathData)
        }
      })
    },

    // 备选方案：使用简单的二次贝塞尔曲线（更简洁）
    drawQuadraticCurves() {
      const { lines, paths } = this

      lines.forEach((points, lineIndex) => {
        if (points.length < 2) return

        let pathData = ''

        // 使用二次贝塞尔曲线（Q命令）平滑连接
        for (let i = 0; i < points.length; i++) {
          const p = points[i]
          const x = p.ox + p.cursor.x
          const y = p.oy + p.cursor.y

          if (i === 0) {
            pathData = `M ${x} ${y}`
          } else if (i === 1) {
            // 第二个点直接连接
            pathData += ` L ${x} ${y}`
          } else {
            // 计算控制点（前后点的中间）
            const prevP = points[i - 1]
            const prevX = prevP.ox + prevP.cursor.x
            const prevY = prevP.oy + prevP.cursor.y

            const controlX = (prevX + x) / 2
            const controlY = (prevY + y) / 2

            pathData += ` Q ${controlX} ${controlY} ${x} ${y}`
          }
        }

        if (paths[lineIndex]) {
          paths[lineIndex].setAttribute('d', pathData)
        }
      })
    },

    // 最简单的平滑方案：使用张力参数
    drawTensionLines(tension = 0.5) {
      const { lines, paths } = this

      lines.forEach((points, lineIndex) => {
        if (points.length < 3) return

        let pathData = ''

        // 起始点
        const firstP = points[0]
        pathData = `M ${firstP.ox + firstP.cursor.x} ${firstP.oy + firstP.cursor.y}`

        // 创建平滑曲线
        for (let i = 1; i < points.length - 1; i++) {
          const p0 = points[i - 1]
          const p1 = points[i]
          const p2 = points[i + 1]

          const x0 = p0.ox + p0.cursor.x
          const y0 = p0.oy + p0.cursor.y
          const x1 = p1.ox + p1.cursor.x
          const y1 = p1.oy + p1.cursor.y
          const x2 = p2.ox + p2.cursor.x
          const y2 = p2.oy + p2.cursor.y

          // 计算控制点
          const cp1x = x0 + (x1 - x0) * tension
          const cp1y = y0 + (y1 - y0) * tension
          const cp2x = x1 - (x2 - x1) * tension
          const cp2y = y1 - (y2 - y1) * tension

          pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1} ${y1}`
        }

        // 最后一个点
        const lastP = points[points.length - 1]
        pathData += ` L ${lastP.ox + lastP.cursor.x} ${lastP.oy + lastP.cursor.y}`

        if (paths[lineIndex]) {
          paths[lineIndex].setAttribute('d', pathData)
        }
      })
    }
  }
}
</script>

<style scoped>
.waves-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f7f7f7;
  cursor: none;
}

.waves-container svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
