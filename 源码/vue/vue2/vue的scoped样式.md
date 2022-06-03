# 原理

## scoped

表现形式

![添加scoped](https://tva1.sinaimg.cn/large/0081Kckwgy1gl18aq3fnqj30x20goab5.jpg)

通过相应的loader， 给组件html 模板添加自定义属性(Attribute)data-v-x， 以及给组件内css选择器添加对应的属性选择器（Attribute Selector）【data-v-x】，达到组件内样式只能生效与组件内HTML的效果

每个单文件组件被解析后，都会生成对应组件ID， ID主要用以区分生产、开发环境。

```js
// vue-loader/index.js
const id = hash(isProduction  (shortFilePath + '\n' + source) : shortFilePath)
const hasScoped = descriptor.styles.some(s => s.scoped)
const query = `? vue&type=template${idQuery}${scopedQuery}`
const request = templateRequest = stringifyRequest(src + query)
templateImport = `import { render, staticRenderFns } from ${request}`
```

postcss 给一个组件中的所有 dom 添加了一个独一无二的动态属性

为什么需要scoped

还有种场景
引用了第三方组件，需要在组件中局部修改第三方组件的样式，而又不想去除scoped属性造成组件之间的样式污染， 此时只能通过特殊的方式，穿透scoped。

1. 方法一

```js
  // >>>  还有 deep
  /* 穿透之后可以顺利修改element-ui样式 */
 .el-contain-row /deep/ .el-table__header-wrapper {
    height: 20px;
  }

```

2. 方法二

```js
 // 两个style 标签

<style>
/* 用于修改第三方库的样式 */
</style>
 
<style scoped>
/* 自己的组件内样式 */
</style>


```
