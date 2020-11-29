# ES6之Set和Map

Set

1. 成员不能重复
2. 只有健值，没有健名，有点类似数组。
3. 可以遍历，方法有add, delete,has

weakSet

1. 成员都是对象
1. 成员都是弱引用，随时可以消失。 可以用来保存DOM节点，不容易造成内存泄漏
1. 不能遍历，方法有add, delete,has

Map

1. 本质上是健值对的集合，类似集合
1. 可以遍历，方法很多，可以跟各种数据格式转换

weakMap

1. 直接受对象作为健名（null除外），不接受其他类型的值作为健名
1. 健名所指向的对象，不计入垃圾回收机制
1. 不能遍历，方法同get,set,has,delete


Set 实例属性

constructor： 构造函数

size：元素数量

```js      
let set = new Set([1, 2, 3, 2, 1])

console.log(set.length)	// undefined
console.log(set.size)	// 3
```

Set 实例方法

操作方法
add(value)：新增，相当于 array里的push

delete(value)：存在即删除集合中value

has(value)：判断集合中是否存在 value

clear()：清空集合

遍历方法（遍历顺序为插入顺序）
keys()：返回一个包含集合中所有键的迭代器

values()：返回一个包含集合中所有值得迭代器

entries()：返回一个包含Set对象中所有元素得键值对迭代器

forEach(callbackFn, thisArg)：用于对集合成员执行callbackFn操作，如果提供了 thisArg 参数，回调中的this会是这个参数，没有返回值

WeakSet
WeakSet 对象允许你将弱引用对象储存在一个集合中

WeakSet 与 Set 的区别：

WeakSet 只能储存对象引用，不能存放值，而 Set 对象都可以
WeakSet 对象中储存的对象值都是被弱引用的，即垃圾回收机制不考虑 WeakSet 对该对象的应用，

字典

集合 与 字典 的区别：

共同点：集合、字典 可以储存不重复的值
不同点：集合 是以 [value, value]的形式储存元素，字典 是以 [key, value] 的形式储存

const m = new Map()
const o = {p: 'haha'}
m.set(o, 'content')
m.get(o)	// content

m.has(o)	// true
m.delete(o)	// true
m.has(o)	// false

Set
成员唯一、无序且不重复
[value, value]，键值与键名是一致的（或者说只有键值，没有键名）
可以遍历，方法有：add、delete、has
WeakSet
成员都是对象
成员都是弱引用，可以被垃圾回收机制回收，可以用来保存DOM节点，不容易造成内存泄漏
不能遍历，方法有add、delete、has
Map
本质上是键值对的集合，类似集合
可以遍历，方法很多可以跟各种数据格式转换
WeakMap
只接受对象作为键名（null除外），不接受其他类型的值作为键名
键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
不能遍历，方法有get、set、has、delete

