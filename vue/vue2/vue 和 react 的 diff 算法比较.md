## 传统的 diff 算法

渲染递归每个节点

## vue 和 react 的 diff 算法对比

  vue 和 react 的 diff 算法,都是忽略跨级比较,只做同级比较.vue diff 时调动 patch 函数,参数是 vnode 和 oldVnode, 分别代表新旧节点.



## 
vue 对比节点,当节点元素类型相同,但是 className 不同, 任务是不同类型元素,删除重建,而 react 会认为是同类型节点,只是修改节点属性.




##  
vue 的对比是从中间到两端, react 则是从左到右依次对比的方式,当一个集合,只是把最后一个节点移动到第一个,react 会把前面的节点依次移动,而 vue 只会把最后一个节点移动到第一个.