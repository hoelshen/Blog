# svg

格式解析

## 实现 svg 的三种方式

### unicode

### font-class

第一步：拷贝项目下面生成的 fontclass 代码：
//at.alicdn.com/t/font_8d5l8fzk5b87iudi.css
第二步：挑选相应图标并获取类名，应用于页面：
<i class="iconfont icon-xxx"></i>

### symbol

第一步：拷贝项目下面生成的 symbol 代码：
//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js
第二步：加入通用 css 代码（引入一次就行）：

```css
<style type="text/css">
    .icon {
       width: 1em; height: 1em;
       vertical-align: -0.15em;
       fill: currentColor;
       overflow: hidden;
    }
</style>
```

第三步：挑选相应图标并获取类名，应用于页面：

```jsx
<svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-xxx"></use>
</svg>
```

##

## react

```jsx
<svg width="10" height="10">
  <rect x="0" y="0" width="10" height="10" fill="blue" />
</svg>
```

## svg 语法

SVG 使用 XML 来定义它的图像。常用的元素有：

text: 创建一个文字元素
circle: 创建一个圆形
ellipse： 创建一个椭圆
rect: 创建一个矩形
line: 创建一条直线
path: 创建一个路径
textPath: 创建一个文本路径
polygon: 创建一个多边形
g: 创建一个元素组

SVG 图像是使用各种元素创建的，这些元素分别应用于矢量图像的结构、绘制与布局。在这里，您可以找到每个 SVG 元素的参考文档。
[常见参考元素](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element)

## 参考文献
