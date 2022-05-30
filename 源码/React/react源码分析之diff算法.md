
传统的 diff 算法复杂度为O(n^3)

react 优化的 diff 策略

* 在前端页面中， DOM 节点跨层级的移动操作特别少,可以忽略不计
* 拥有相同类型的两个组件将会生成相似的树形结构，拥有不同类型的两个组件将会生
不同的树形结构。
* 对于同一层级的一组子节点，它们可以通过唯一 id 进行区分.

```js
//对比两棵树
function diff(oldTree, newTree){
  // 当前节点的标志, 以后每遍历到一个节点, 加 1
  var index = 0;
  var patches = {}  // 用来记录每个节点差异的对象
  dfsWalk(oldTree, newTree,index,patches)
  return patches
}

// 对两棵树进行深度优先遍历
function dfsWalk(onldNode , newNode , index, patches){
  // 对比 oldNode 和 newNode 的不同, 记录下来
  patches[index]  = [...]

  diffChildren(oldNode.children, newNode.children, index, patches)
}

//遍历子节点
function diffChildren(oldChildren, newChildren, index,patches){
  var leftNode = null
  var currentNodeIndex = index;

  oldChildren.forEach(function (child, i){
    var newChild = newChildren[i]
    currentNodeIndex = (leftNode && leftNode.count)  // 计算节点的标识
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1
      dfsWalk(child, newChild, currentNodeIndex, patches)  // 深度遍历子节点
  })


}
```

将差异保存在 patches 对象中.

1. 插入: patches[0]:{type:'INSERT_MARKUP',node: newNode }
2. 移动: patches[0]: {type: 'MOVE_EXISTING'}
3. 删除: patches[0]: {type: 'REMOVE_NODE'}
4. 文本内容改变: patches[0]: {type: 'TEXT_CONTENT',content: 'virtual DOM2'}
5. 属性改变: patches[0]: {type: 'SET_MARKUP',props: {className:''}}

React 对树的比较算法 实际上只对树进行分层比较，两棵树只会对同一层次的节点进行比较。这样只要对树进行一次遍历，便能完成整棵 DOM 树的比较。基于第一点，
React 在进行 diff 时，如果发现对比两项是同一类型的组件，则按照原策略继续比较. 如果类型不同，则直接进行替换，而不再对组件下的其他节点进行比较. 基于第三点 React 表节点组件.通过开发者设置的唯一 key ,来协助实现添加、删除和排序的操作。

React 最新的 reconciliation 引擎是 Fiber ，隐藏在 Fiber 之后的思想非常有趣：旧的 reconciliation 过程是线性的、同步的.即一旦 reconciliation 过程开始就不能中断 Fiber 却不一样，它打破了阻塞设计。

React的开发者结合Web界面的特点做出了两个大胆的假设，使得Diff算法复杂度直接从O(n^3)降低到O(n)，假设如下：

两个相同组件产生类似的DOM结构，不同的组件产生不同的DOM结构；
对于同一层次的一组子节点，它们可以通过唯一的id进行区分。
通过这两个假设，他们提供了下面的Diff算法思路。
同层比较
不同类型节点的比较
相同类型节点的比较
列表节点的比较
vue的diff 采取了相似的节点操作

1.判断1：oldStartVnode是否为空，若为true则oldStartIdx向后移动，继续下一个节点的判断。
2.判断2：oldEndVnode是否为空，若为true则oldEndIdx向前移动。
3.判断3：使用 sameVnode判断before和after未判断的头节点是否为相同节点，若为true，则按照上面思路说的，对相同类型节点进行节点的属性的更新并修改哨兵位置。
4.判断4：使用上一步相同的方法对oldEndVnode和newEndVnode进行判断。
