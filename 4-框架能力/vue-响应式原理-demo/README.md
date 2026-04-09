# Vue 响应式原理 Demo

这个目录现在只保留“响应式实现本身”的最小浏览器 demo，不再做 Vue2 / Vue3 同屏对比，也不再放动态属性、数组这些分支题。

你只需要看一条主链路：

- 读取 `count`
- 收集依赖
- 修改 `count`
- 触发更新
- `effect` 重新执行

## 文件说明

- `index.html`
  - 目录入口页
  - 提供 Vue2 / Vue3 两个独立 demo 链接
- `style.css`
  - 页面样式
- `vue2.html`
  - Vue2 独立页面
  - 只演示 `Object.defineProperty` 的主链路
- `vue3.html`
  - Vue3 独立页面
  - 只演示 `Proxy` 的主链路
- `vue2-reactivity-demo.js`
  - Vue2 风格最小响应式实现
  - 基于 `Object.defineProperty`
- `vue3-reactivity-demo.js`
  - Vue3 风格最小响应式实现
  - 基于 `Proxy`

## 运行方式

推荐在仓库根目录启动一个最简单的静态服务器：

```bash
python3 -m http.server 8000
```

然后在浏览器打开：

```text
http://localhost:8000/4-框架能力/vue-响应式原理-demo/
```

## 怎么看

打开任意一个页面后，只看这 3 个动作：

- 页面初始化
  - 先执行一次 `effect`
- 点击 `主动读取 count`
  - 看读取动作本身发生了什么
- 点击 `count + 1`
  - 看修改后如何触发重新渲染

## 建议怎么学

先看页面中间的 `count`，再看下面的日志。日志里只有 3 类信息：

- `track`
  - 什么时候发生依赖收集
- `trigger`
  - 什么时候触发更新
- `effect`
  - 页面上的状态什么时候重新渲染

如果你现在目标是先吃透核心链路，建议顺序就是：

1. 先看 `vue2.html`
2. 再看 `vue3.html`
3. 最后再对照两份 js 实现文件

## 注意

- 这是学习版最小实现，不是 Vue 源码复刻
- 目的是帮你先把“响应式闭环”看清楚
- 没有实现调度、依赖清理、嵌套对象代理、数组拦截等框架级细节
