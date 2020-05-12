
## 用法
useMemo是不是有点像vue中的计算属性 只有useMemo(() => {}, []) 第二个依赖项shallowEqual相等才重新执行函数并将结果作为useMemo的返回值
## 原理

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdz42f4l0sj30h20b4dg3.jpg)

## 坑
useMemo并不能够控制子组件的渲染，它用来控制它包装的函数的重新执行