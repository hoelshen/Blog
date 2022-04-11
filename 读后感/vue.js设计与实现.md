# vue的设计与实现

## 1. 权衡的艺术

### 声明式和命令式

* 命令式框架的一大特点就是关注过程---jquery
* 声明式框架更关注结果--vue  vue内部实现一定是命令式的, 而暴露给用户的缺更加声明式

总结: 声明式代码的性能不优于命令式代码代码的性能

原因如下:

    直接修改的性能消耗定义为A  找出差异的消耗定义为B

则

    命令式代码的更新性能消耗≈A
    声明式代码的更新性能消耗≈B+A

* 比较innerHTML和虚拟DOM的性能

对于innerHTML来说, 为了创建页面, 我们需要先把字符串解析成dom树, 这是一个DOM层面的计算, 涉及到DOM的运算要远比Javascript层面的计算性能差.

    innerHTML创建页面的性能: HTML字符串拼接的计算量 + innerHTML的DOM计算量

虚拟DOM创建页面的过程分为两步:
第一步是创建JavaScript对象, 这个对象可以理解为真实DOM层面的描述;
第二步是递归地遍历虚拟DOM树并创建真实DOM

    虚拟DOM创建页面的性能: 创建JavaScript对象的计算量 + 创建真实DOM的计算量

innerHTML和document.createElement等DOM操作方法有何差异

当设计框架时候我们有三种选择: 纯运行时 运行时+ 编译时或纯编译时

* 纯运行时: render函数 处理数据对象 渲染到页面

* 编译时: 编译得到树形结构的数据对象

compiler的程序, 它的作用就是把HTML字符串编译成树形结构的数据对象

* 运行时 + 编译时 相结合 就是把这两个组合起来  即支持编译时, 用户可以提供HTML字符串, 我们将其编译成数据对象再交给运行时处理

准确来说 其实是运行时编译, 意思是代码运行的时候才开始编译, 而这会产生一定的开销, 因此我们也可以在构建的时候就执行Compiler程序将用户提供的内容编译好, 等到运行时就无需编译了, 这对性能是非常友好的.

* 纯编译时 直接将HTML字符串编译成命令式代码

```html
< div>
    < span> hello world < /span>
< /div>
```

编译

```js
const div = document.createElement('div');
const span = document.createElement('span');
span.innerText = 'hello world';
div.appendChild(span);
document.body.appendChild(div)
```

纯运行时: 由于没有编译过程, 我们没办法分析用户提供内容, 但如果加入编译步骤, 我们可以分析用户提供的内容, 进行优化, 并在render函数得到这些信息之后, 进行优化.
纯编译时: 也能做到内容的分析, 并优化.

Tree-Shaking 是一种排除DEAD CODE 的机制 工具/*#__PURE__*/ 注释
Tree-Shaking 依赖于ESM的静态结构以及是否产生副作用, 如果一个函数的副作用 调用函数的时候会对外部产生影响

rollup 配置里面format有三种形式: 'iife', 'esm', 'cjs'

1. 在浏览器环境中,除了能够用scripts标签引用iife格式的资源外,还可以直接引用ESM格式的资源

2. 在node.js环境中 资源的模块格式应该是commonJs

如果在package.json 中存在module 字段,那么会优先使用module 字段指向的资源来替代main字段指向的资源

* vue.runtime.esm-bundler.js
* vue.runtime.esm-browser.js

带有 -bundler 字样的 ESM 资源是在rollup.js 或webpack等打包工具使用,而带有 -browser 字样的ESM资源是直接给 "<script type='module'>" 使用的
它们的区别在与__DEV__常量替换为字面量true或者false, 后者将_DEV_常量替换为process.env.NODE_ENV !== 'production' 语句

**使用模板和 JavaScript 对象描述UI有何不同: 使用 JavaScript 对象描述UI更加灵活.**

**而使用 JavaScript 对象描述UI的方式, 其实就是所谓的虚拟DOM**

所以vue.js 除了支持使用模板描述UI外,还支持使用虚拟DOM描述UI.

```vue
import { h} form 'vue'
export default {
    render() {
        return h('h1', { onClick: handler }) //  虚拟DOM  
    }
}

```

这里用到的h函数调用,返回值,就是一个对象, 其作用就是让我们编写虚拟DOM更加轻松

虚拟DOM: 用 JavaScript 对象来描述真实的DOM结构

渲染器的作用就是把虚拟DOM渲染为真实DOM

渲染器render的实现思路:

1.创建元素
2.为元素添加属性和事件
3. 处理children

组件就是一组DOM元素的封装,它可以返回虚拟DOM的函数,也可以是一个对象,但这个对象下必须要有一个函数用来产生组件要渲染的虚拟DOM.

render 函数 要处理 组件
```js
function mountElement(vnode, container){
    const el = document.element(vnode.tag);

    for(const key in vnode.props){
        if(/^on/.test(key)){
            el.addEventListener(
               key.substr(2).toLowerCase(),  // 事件名称 onClick  ---->click
                vnode.props[key]  // 事件处理函数
            )    
        
        };
    }
}
``


编译器的作用就是将模板编译为渲染函数.

对于编译器来说,模板就是一个普通的字符串.

编译器会把模板内容编译成渲染函数并添加到<script>标签块的组件对象上.

对于一个组件来说,它要渲染的内容最终都是通过渲染函数产生的,然后渲染器再把渲染函数返回的虚拟DOM渲染为真实DOM


渲染器在渲染组件时,会先获取组件要渲染的内容,即执行组件的渲染函数并得到返回值,我们称之为subtree,最后在递归地调用渲染器将subtree渲染出来即可.

## 响应系统

响应函数和副作用

指的是会产生副作用的函数
