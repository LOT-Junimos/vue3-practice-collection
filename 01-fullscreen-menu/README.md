# Vue3 全屏侧边菜单组件
> 一个基于 Vue3 Setup 语法糖实现的全屏菜单组件，点击右上角汉堡按钮可展开/收起全屏菜单，包含交互动效和hover样式优化。

## 🌐 在线预览
https://vue3-practice-collection.vercel.app/

## 🎯 功能亮点
1. 响应式状态管理：用 Vue3 ref 实现菜单/按钮状态联动，一个变量控制全局状态
2. 交互动效：菜单展开/收起带「缩放+透明度」过渡动画，文字hover下划线从右到左展开
3. 样式封装：scoped 样式隔离，避免全局样式污染，兼容不同项目引入
4. 资源管理：图标文件放在 public 目录，通过根路径引用，符合 Vue3 资源加载规范

## 📱 效果说明
- 默认状态：右上角显示橙色汉堡按钮，全屏紫色菜单隐藏
- 点击按钮：按钮切换为关闭图标，菜单以缩放+透明度过渡效果展开
- 菜单文字hover：橙色下划线从右到左渐变显示，提升交互体验
- 再次点击：菜单收起，按钮恢复为汉堡图标，动画反向执行

## 🛠 技术点（Vue3 核心）
| 技术点                | 说明                          |
|-----------------------|-------------------------------|
| Script Setup 语法糖   | Vue3 推荐写法，无需 return，代码更简洁 |
| ref 响应式变量        | 单一变量控制菜单/按钮激活状态，无冗余 |
| 动态class绑定         | 根据 isActive 切换样式类，实现状态可视化 |
| 点击事件绑定 (@click) | 极简逻辑实现菜单切换，易维护     |
| scoped 样式           | 组件样式隔离，避免全局样式冲突   |
| CSS 过渡动画          | 组合 opacity/transform/transition 实现丝滑动效 |
| public 目录资源引用   | 图标文件根路径引用，符合 Vue3 静态资源规范 |

## 🚀 本地运行（可直接执行）
```bash
# 1. 克隆仓库
git clone https://github.com/LOT-Junimos/vue3-practice-collection.git

# 2. 进入当前练习文件夹
cd vue3-practice-collection/01-fullscreen-menu

# 3. 安装依赖（Vue3 + Vite 核心依赖）
npm install

# 4. 启动本地服务
npm run dev

# 5. 访问地址
http://localhost:5173/
