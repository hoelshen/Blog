# treeShaking

## 原理

本质上是 babel 通过核心 babylon 将 ES6 代码转换成AST抽象语法树，然后插件遍历语法树找出类似 import {Button} from 'element-ui'这样的语句，进行转换，最后重新生成代码。

tree-shaking 的消除原理是依赖于ES6的模块特性。

我们先看看 ES6 import 的特性
依赖关系是可以确定的

 * 只能作为模块顶层的语句出现

 * import 的模块名只能是字符串常量

 * import binding 是 immutable的
  
依赖关系是确定， 和运行时的状态无关， 可以进行可靠的静态分析， 然后进行消除

静态扽洗就是不执行代码,从字面量商对代码进行分析,es6之前的模块化,比如我们可以动态 require 一个,只有执行之后才知道引用什么模块,这个就不能通过静态分析去优化.

这是 ES6 modules 在设计时的一个重要考量，也是为什么没有直接采用 CommonJS，正是基于这个基础上


treeshaking 只能对函数进行消除  无法对类进行消除

```js
function Menu() {
}

Menu.prototype.show = function() {
}

var a = 'Arr' + 'ay'
var b
if(a == 'Array') {
    b = Array
} else {
    b = Menu
}

b.prototype.unique = function() {
    // 将 array 中的重复元素去除
}

export default Menu;

```

下面这个例子静态分析是分析不了的
函数的副作用相对较少，顶层函数相对来说更容易分析，加上babel默认都是"use strict"严格模式，减少顶层函数的动态访问的方式，也更容易分析

## css tree-shaking

下面介绍一下原理

整体思路是这样的，遍历所有的css文件中的selector选择器，然后去所有js代码中匹配，如果选择器没有在代码出现过，则认为该选择器是无用代码。

首先面临的问题是，如何优雅的遍历所有的选择器呢？难道要用正则表达式很苦逼的去匹配分割吗？

abel是js世界的福星，其实css世界也有利器，那就是postCss。

PostCSS 提供了一个解析器，它能够将 CSS 解析成AST抽象语法树。然后我们能写各种插件，对抽象语法树做处理，最终生成新的css文件，以达到对css进行精确修改的目的。



主要流程：

插件监听webapck编译完成事件，webpack编译完成之后，从compilation中找出所有的css文件和js文件


```js
apply (compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {

      let styleFiles = Object.keys(compilation.assets).filter(asset => {
        return /\.css$/.test(asset)
      })

      let jsFiles = Object.keys(compilation.assets).filter(asset => {
        return /\.(js|jsx)$/.test(asset)
      })

     ....
}

```

将所有的 css 文件送至 postCSS处理, 找出无用代码

```js
   let tasks = []
    styleFiles.forEach((filename) => {
        const source = compilation.assets[filename].source()
        let listOpts = {
          include: '',
          source: jsContents,  //传入全部js文件
          opts: this.options   //插件配置选项
        }
        tasks.push(postcss(treeShakingPlugin(listOpts)).process(source).then(result => {       
          let css = result.toString()  // postCss处理后的css AST  
          //替换webpack的编译产物compilation
          compilation.assets[filename] = {
            source: () => css,
            size: () => css.length
          }
          return result
        }))
    })
```

可以看到其实我只处理里 id选择器和class选择器，id和class相对来说副作用小，引起样式异常的可能性相对较小。判断css是否再js中出现过，是使用正则匹配。其实，后续还可以继续优化，比如对tag类的选择器，可以配置是否再html，jsx，template中出现过，如果出现过，没有出现过也可以认为是无用代码。
