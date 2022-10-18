# svg 总是不对

先讲下缘由
某天找设计师 要图标的时候， 发来一个 codeDesign 的链接 咱就去下载， 下载下来后 运用内部的 svg 转换工具 转成 iconfont 没想到， 在页面上的效果跟 svg 的样式不一致，咱也不敢直接怀疑设计师给的有问题。只能自己排查。后面实在是找不到问题，只能让设计师重新发一遍，没想到重发的可以了，遂对比下前后。

## 原理

先了解下什么是 svg

svg 在变大变小的情况下不会失真（出现锯齿或者看到像素点），也可以像 GIF 一样动起来。

```css
SVG优缺点：
优点	缺点
1.缩放无损还原，显示清晰	1.SVG在绘制的性能上比PNG要差
2.语义性良好	2.局限性，对应单色或普通渐变没什么问题，但对不规则的渐变以及特效叠加效果显示不全
3.可用CSS控制图标样式以及动画	3.兼容性稍差，android4.1才开始支持
4.减少http请求	4.学习应用成本较高
```

## web 中使用 svg 的使用方式

1. inline svg ， 直接把 svg 写入 HTML 中

不需要在单独去请求，修改图标的形状也方便。

```html
<body>
  <svg width="100%" height="100%">
    <rect x="20" y="20" width="250" height="250" style="fill:#fecdddd;" />
  </svg>
</body>
```

2. img object embed 标签直接引用 svg

```html
<body>
  <img src="test.svg" alt="test svg" />
</body>
```

3. SVG Sprite

这里的 Sprite 技术，类似于 CSS 中的 Sprite 技术。图标图形整合在一起，实际呈现的时候准确显示特定图标。其实基础的 SVG Sprite 也只是将原来的位图改成了 SVG 而已，控制 SVG 大小、颜色需要重新合并 SVG 文件。

```html
.icon-bg{ display: inline-block; width: 30px; height: 30px; background:
url(./res/svg-sprite-background.svg); background-size:100% 100%; }
.icon-facebook-logo{ background-position: 0 0; } .icon-earth{
background-position: 0 -30px; }

<span class="icon-bg icon-facebook-logo"></span>
<span class="icon-bg icon-earth"></span>
```

4.使用 SVG 中的 symbol，use 元素来制作 SVG Sprite

SVG Symbols 的使用，本质上是对 Sprite 的进一步优化，通过<symbol>元素来对单个 svg 元素进行分组，使用<use>元素引用并进行渲染。这种方法的解决了上述三种方式带来的弊端，少量的 http 请求，图标能被缓存方便复用，每个 SVG 图标可以更改大小颜色，整合、使用以及管理起来非常简单。

①SVG Symbols 作为 body 的第一个元素插入在 HTML 中使用：

```html
<body>
  <svg
    style="width:0; height:0; visibility:hidden;position:absolute;z-index:-1"
  >
    <symbol viewBox="0 0 24 24" id="heart">
      <path
        fill="#E86C60"
        d="M17,0c-1.9,0-3.7,0.8-5,2.1C10.7,0.8,8.9,0,7,0C3.1,0,0,3.1,0,7c0,6.4,10.9,15.4,11.4,15.8 c0.2,0.2,0.4,0.2,0.6,0.2s0.4-0.1,0.6-0.2C13.1,22.4,24,13.4,24,7C24,3.1,20.9,0,17,0z"
      ></path>
    </symbol>
  </svg>

  <svg>
    <use xlink:href="#heart" />
  </svg>
</body>
```

## 遇到的坑

1. svg 事件没有触发
   直接在 svg 组件上绑定 onClick 事件，这个事件在有的浏览器上面并不会触发，我们应该在外层去添加事件，外层套个 i 标签或者 button 标签

2.

3.
