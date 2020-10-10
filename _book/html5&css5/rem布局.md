1. 方法一：在 index.html 或者 main.js 中添加以下代码：
```js
const setHtmlFontSize = () => {
  const htmlDom = document.getElementsByTagName('html')[0];
  let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
  if (htmlWidth >= 750) {
    htmlWidth = 750;
  }
  if (htmlWidth <= 320) {
    htmlWidth = 320;
  }
  htmlDom.style.fontSize = `${htmlWidth / 7.5}px`;
};
window.onresize = setHtmlFontSize;
setHtmlFontSize();
```
注： 这里设置的比例是 100px = 1rem，例如：元素宽度为 100px 时,可以直接写成 1rem

2. 方法二：使用 lib-flexible 和 px2rem-loader 自动转换

安装插件
```js
npm install lib-flexible --save
npm install px2rem-loader --save-dev
```
配置插件
在入口文件 main.js 中引入 lib-flexible：
引入 lib-flexible
在 build/utils.js 文件中配置 px2rem-loader：
配置 px2rem-loader
安装并配置好 lib-flexible 和 px2rem 之后要重启一下项目，才能自动把 px 转换成 rem。
内联的 px 样式不能自动转换。
![](http://pvt7l4h05.bkt.clouddn.com/2019-11-19-173312.png)

另外，px 写法上会有些不同，大家可以参考 px2rem![https://www.npmjs.com/package/px2rem] 官方介绍，下面简单介绍一下。
1. 直接写 px，编译后会直接转化成 rem；---- 【除下面两种情况，其他长度用这个】
2. 在 px 后面添加 /*no*/，不会转化 px，会原样输出； ---- 【一般 border 用这个】
3. 在 px 后面添加 /*px*/，会根据 dpr 的不同，生成三套代码。---- 【一般 font-size 用这个】

示例代码如下：
```js
/* 编译前 */
.selector {
    width: 150px;
    height: 64px; /*px*/
    font-size: 28px; /*px*/
    border: 1px solid #ddd; /*no*/
}

/* 编译后 */
.selector {
    width: 2rem;
    border: 1px solid #ddd;
}
[data-dpr="1"] .selector {
    height: 32px;
    font-size: 14px;
}
[data-dpr="2"] .selector {
    height: 64px;
    font-size: 28px;
}
[data-dpr="3"] .selector {
    height: 96px;
    font-size: 42px;
}
```