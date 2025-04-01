# treeShaking（树摇Tree Shaking）

## 原理

本质上是 babel 通过核心 babylon 将 ES6 代码转换成AST抽象语法树，然后插件遍历语法树找出类似 import {Button} from 'element-ui'这样的语句，进行转换，最后重新生成代码。

tree-shaking 的消除原理是依赖于ES6的模块特性。

* 只顶层语句：import 只能出现在模块顶层，无法嵌套在条件语句中。

* 静态字符串 模块名必须是字符串常量（如 import x from './x'），不能是动态表达式。

* 不可变绑定： import 的绑定是只读的（immutable），不会被运行时修改。
  
这些特性使得依赖关系在编译时就能被确定，与运行时状态无关，因此可以可靠地进行静态分析并消除未使用的代码。相比之下，CommonJS 的 require 支持动态加载（例如 require(变量)），需要在运行时才能确定依赖，无法通过静态分析优化。这也是 ES6 模块设计时的重要考量。

## 注意点

Tree Shaking 的局限性


Tree Shaking 并非万能，它有一些限制：

1. 仅对函数有效

Tree Shaking 通常只能消除未使用的函数，而对类（class）的优化效果有限。原因在于类的副作用（如原型方法）较难静态分析。

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

2. 副作用问题：

如果模块存在副作用（side effects），如修改全局变量或动态操作，Tree Shaking 可能无法安全移除代码。

## css tree-shaking

下面介绍一下原理

整体思路是这样的，遍历所有的 css 文件中的 selector 选择器，然后去所有 js 代码中匹配，如果选择器没有在代码出现过，则认为该选择器是无用代码。

首先面临的问题是，如何优雅的遍历所有的选择器呢？难道要用正则表达式很苦逼的去匹配分割吗？

babel 是 js 世界的福星，其实 css 世界也有利器，那就是postCss。

PostCss 本质上是一个平台.

PostCSS 提供了一个解析器，它能够将 CSS 解析成AST抽象语法树。然后我们能写各种插件，对抽象语法树做处理，最终生成新的css文件，以达到对css进行精确修改的目的。

主要流程：

插件监听webapck编译完成事件，webpack编译完成之后，从 compilation 中找出所有的css文件和js文件

```js
apply (compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {

      let styleFiles = Object.keys(compilation.assets).filter(asset => {
        return /\.css$/.test(asset)
      })

      let jsFiles = Object.keys(compilation.assets).filter(asset => {
        return /\.(js|jsx)$/.test(asset)
      })
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

## 遇到的问题及解决
1. 副作用导致无法消除：

一些模块可能包含副作用（如立即执行函数 IIFE），被标记为不可 Tree Shaking。
解决方法：  

* 在 package.json 中配置 "sideEffects": false，告诉构建工具该模块无副作用。

* Webpack 中设置 { module: false }，禁用某些模块的副作用推断。

2. 动态逻辑干扰：

如上文示例中的条件语句，动态引用会导致 Tree Shaking 失效。

  * 解决方法：尽量将逻辑静态化，或通过工具（如 babel-plugin-transform-imports）优化导入。


