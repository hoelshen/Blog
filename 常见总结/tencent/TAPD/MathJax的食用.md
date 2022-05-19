
# MathJax的食用

## 如何安装

```js
<script id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
</script>
```

## 如何使用

### 加载Mathjax不同的模块

* tex-chtml  会加载 ams, newcommand, require, autoload, configMacros, 和 noundefined。这意味着大部分情况下能满足你基本需求。你也可以使用 require 自己加载更多模块。

* tex-chtml-full 会包含tex-chtml的内容，同时还包括input/tex-full 等但是不包含 physics 和 colorV2

* tex-svg  mathjax默认以字体输出公式，如果你需要是svg输出公式，请使用svg包。

* tex-svg-full：包含全部以svg输出格式。

* tex-mml-chtml（常用）：包含了对MathML 语言的支持，显示时以字体方式显示。

* tex-mml-svg：包含了对MathML 语言的支持，显示时以svg方式显示。

* mml-chtml 不包含Tex，支持MathML，以文字显示。
* mml-svg：不包含Tex，以SVG方式显示。
