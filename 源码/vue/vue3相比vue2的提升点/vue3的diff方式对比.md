
## 预处理优化

在Vue3中首先会进行头尾的单向遍历，进行预处理优化。

1. 从头开始遍历
首先会遍历开始节点，判断新老的第一个节点是否是同一个节点，相同的话，执行patch方法更新差异，然后往下继续比较，否则break跳出。可以看到下图中，A vs A是一样的，然后去比较B，B也是相同的节点，再去比较C vs F，发现不一样了
2. 尾部开始遍历

```js
const patchChildren: PatchChildrenFn = () => {
    // 获得当前新旧节点下的子节点们
    const c1 = n1 && n1.children
    const prevShapeFlag = n1 ? n1.shapeFlag : 0
    const c2 = n2.children

    const { patchFlag, shapeFlag } = n2
    // fragment有两种类型的静态标记：子节点有key、子节点无key
    if (patchFlag > 0) {
      if (patchFlag & PatchFlags.KEYED_FRAGMENT) {
        // 子节点全部或者部分有key
        patchKeyedChildren()
        return
      } else if (patchFlag & PatchFlags.UNKEYED_FRAGMENT) {
        // 子节点没有key
        patchUnkeyedChildren()
        return
      }
    }

    // 子节点有三种可能：文本节点、数组（至少一个子节点）、没有子节点
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 匹配到当前是文本节点：卸载之前的节点，为其设置文本节点
      unmountChildren()
      hostSetElementText()
    } else {
      // old子节点是数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 现在(new)也是数组（至少一个子节点），直接full diff（调用patchKeyedChildren()）
        } else {
          // 否则当前没有子节点，直接卸载当前所有的子节点
          unmountChildren()
        }
      } else {
        // old的子节点是文本或者没有
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 清空文本
          hostSetElementText(container, '')
        }
        // 现在(new)的节点是多个子节点，直接新增
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 新建子节点
          mountChildren()
        }
      }
    }
  }
  ```

我们可以直接用文本描述一下这段代码：
1、获得当前新旧节点下的子节点们(c1、c2)；
2、使用patchFlag进行按位与判断fragment的子节点是否有key（patchFlag是什么稍后下面说）；
3、不管有没有key，只要匹配成功一定是数组，有key/部分有key则调用patchKeyedChildren方法进行diff计算，无key则调用patchUnkeyedChildren方法；
4、不是fragment节点，那么子节点有三种可能：文本节点、数组(至少一个子节点)、没有子节点；
5、如果new的子节点是文本节点：old有子节点的话则直接进行卸载，并为其设置文本节点；
6、否则new的子节点是数组 or 无节点，在这个基础上：

如果old的子节点为数组，那么new的子节点也是数组的话，调用patchKeyedChildren方法，直接full diff，否则new没有子节点，直接进行卸载。
最后old的子节点为文本节点 or 没有节点（此时新节点可能为数组，也可能没有节点），所以当old的子节点为文本节点，那么则清空文本，new节点如果是数组的话，直接新增。
7、此时所有的情况已经处理完毕了，不过真正的diff还没开始，那我们来看一下没有key的情况下，是如何进行diff的。
