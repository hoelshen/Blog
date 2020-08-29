# css modules 使用教程

## 模块化方案

1. css 命名规范（比如bem）
2. css in js（比如react-style-component）
3. 使用js 来管理样式模块（比如 css modules）

## css modules

  构建步骤中对css类名选择器限定作用域的一种方式
  A CSS Module is a CSS file in which all class names and animation names are scoped locally by default. CSS 模块就是所有的类名都只有局部作用域的 CSS 文件。

  It doesn’t really matter in the end (although shorter class names mean shorter stylesheets) because the point is that they are dynamically generated, unique, and mapped to the correct styles. 在使用 CSS 模块时，类名是动态生成的，唯一的，并准确对应到源文件中的各个类的样式。

## 为什么要 css 模块化
  css 的规则都是全局的，任何一个组件的样式规则， 都对整个页面有效。

** class 命名写长一点吧，降低冲突的几率
** 加个父元素的选择器，限制范围
** 重新命名个 class 吧，比较保险



## css modules 使用教程

webpack css-loader

启用css modules

编写 index.module.css another-stylesheet.css

```css
//index.module.css
.error {
    background-color: red;
}

//another-stylesheet.css
.error {
    color: red;
}
```

```js
import styles from './index.module.css';
import styles from './Button.module.css'; // 使用 CSS Modules 的方式引入
import './another-stylesheet.css'; // 普通引入

class Button extends Component {
  render() {
    // reference as a js object
    return <button className={styles.table}>123</button>;
  }
}
```

 CSS Modules 按照 localIdentName 自动生成的 class 名。在浏览器看到的效果就是<div class="login_table__a7lac">123</div>

还有一种方式是直接配置module 省略重复书写. webpack.config.js 找到 test: cssRegex

```js

use: getStyleLoaders({
  importLoaders: 1,
  modules: true,
  sourceMap: isEnvProduction && shouldUseSourceMap,
}),

```

用法跟第一种差不多

```js
import React, { Component } from 'react';
import styles from './index.css'; // 可以直接使用 CSS Modules 的方式引入了
import './another-stylesheet.css'; // 普通引入

class Button extends Component {
  render() {
    // reference as a js object
    return <button className={styles.table}>123</button>;
  }
}

```

在浏览器看到的效果就是<div class="ZAzDthWpQaZdGQMixKXL9">123</div>

 react-css-modules

```js
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './table.css';
 
class Table extends React.Component {
    render () {
        return <div styleName='table'>
        </div>;
    }
}
 
export default CSSModules(Table, styles);

```
在react 中使用

```js
import React from 'react';
import styles from './table.css';

export default class Table extends React.Component {
  render () {
    return <div className={styles.table}>
      <div className={styles.row}>
        <div className={styles.cell}>A0</div>
        <div className={styles.cell}>B0</div>
      </div>
    </div>;
  }
}
Rendering the component will produce a markup similar to:

<div class="table__table___32osj">
  <div class="table__row___2w27N">
    <div class="table__cell___1oVw5">A0</div>
    <div class="table__cell___1oVw5">B0</div>
  </div>
</div>
```

我们引入插件 **bable-plugin-react-css-modules**

```js


```