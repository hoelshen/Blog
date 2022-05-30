## 传统的 diff 算法

渲染递归每个节点

## vue 和 react 的 diff 算法对比

  vue 和 react 的 diff 算法,都是忽略跨级比较,只做同级比较.vue diff 时调动 patch 函数,参数是 vnode 和 oldVnode, 分别代表新旧节点.

## vue中的diff算法

  diff 算法是一种通过同层的树节点进行比较的高效算法。diff 整体策略为：深度优先，同层比较

其有两个特点：

* 比较只会在同层级进行, 不会跨层级比较
* 在 diff 比较的过程中，循环从两边向中间比较(vue 的双端比较法)

新旧两个 VNode 节点的左右头尾两侧均有一个变量标识，在遍历过程中这几个变量都会向中间靠拢。当 oldStartIdx <= oldEndIdx 或者 newStartIdx <= newEndIdx 时结束循环。在遍历中，如果存在 key，并且满足 sameVnode，会将该 DOM 节点进行复用(只通过移动节点顺序)，否则则会创建一个新的 DOM 节点。

## vue和react的diff区别

vue 对比节点,当节点元素类型相同,但是 className 不同, 仍然是不同类型元素,删除重建,而 react 会认为是同类型节点,只是修改节点属性.
vue 的对比是从中间到两端, react 则是从左到右依次对比的方式,当一个集合,只是把最后一个节点移动到第一个,react 会把前面的节点依次移动,而 vue 只会把最后一个节点移动到第一个.
