# PostCSS

PostCss 本质上是一个平台.

PostCSS 提供了一个解析器，它能够将 CSS 解析成AST抽象语法树。然后我们能写各种插件，对抽象语法树做处理，最终生成新的css文件，以达到对css进行精确修改的目的。

## PostCSS 相比于 SASS

比如，我们用 SASS 来处理 box-shadow 的前缀，我们需要这样写：

```JS
/* CSS3 box-shadow */
@mixin box-shadow($top, $left, $blur, $size, $color, $inset: false) {
    @if $inset {
        -webkit-box-shadow: inset $top $left $blur $size $color;
        box-shadow: inset $top $left $blur $size $color;
    } @else {
        -webkit-box-shadow: $top $left $blur $size $color;
        box-shadow: $top $left $blur $size $color;
    }
}
```


```JS
box-shadow: 0 0 3px 5px rgba(222, 222, 222, .3);

```

所以，这里就出现了一个经常大家说的未来编码的问题。实际上，PostCSS 改变的是一种开发模式。

SASS等工具：源代码 -> 生产环境 CSS

PostCSS：源代码 -> 标准 CSS -> 生产环境 CSS

## 组成部分

* CSS Parser

* CSS 节点树 API

* source map 生成器

* 生成节点树串


这里看一个 DEMO，主要做 rem 和 px 单位之间的互换，加入 processors 就可以用了，很方便：

```js
var custom = function(css, opts){
    css.eachDecl(function(decl){
        decl.value = decl.value.replace(/\d+rem/, function(str){
            return 16 * parseFloat(str) + "px";
        });
    });
};

```












