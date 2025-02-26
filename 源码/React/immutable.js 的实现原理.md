## 为什么要用immutable.js

因为在react中，react的生命周期中的setState()之后的shouldComponentUpdate()阶段默认返回true，所以会造成本组件和子组件的多余的render，重新生成virtual dom，并进行virtual dom diff，所以解决办法是我们在本组件或者子组件中的shouldComponentUpdate()函数中比较，当不需要render时，不render。

当state中的值是对象时，我们必须使用深拷贝和深比较！

如果不进行深拷贝后再setState，会造成this.state和nextState指向同一个引用，所以shouldComponentUpdate()返回值一定是false，造成state值改了，而组件未渲染（这里不管shouldComponentUpdate中使用的是深比较还是浅比较）。所以必须深拷贝。

如果不在shouldComponentUpdate中进行深比较，会造成即使state中的对象值没有改变，因为是不同的对象，而在shouldComponentUpdate返回true，造成不必要的渲染。

所以只能是深拷贝和深比较。

而深拷贝和深比较都浪费浏览器的性能，所以immutable登场了。

react是一种函数式编程提倡使用纯函数，排斥数据共享以及可变性

React追求数据不可变性的主要的好处之一是为了加速了diff算法中reconcile的过程，React只需要检查object的reference有没有变即可确定数据有没有变。

举个例子：在使用useMemo,useState,shouldComponentUpdate 时，react只会去shallow compare props，只是去检查props的reference有没有变，如果变了，就reRender（重新渲染），简单来讲是这样的：Object.keys(prevProps).some(key => prevProps[key] !== nextProps[key])，只对比对象一层，如果是深对象，就无法判断了。

```javascript
const [todos, setTodos] = useState([{o:1,a:2}]);
const onClick = () => {
     todos[0].a = 3;
     setTodos(todos);//不能reRender
}

```

所以上面的做法是错的。setTodos后，往往不会reRender 。 所以一般新手都会很困惑。
正确的做法是这样,浅拷贝出来后再修改，如果是更深的对象，需要深拷贝后再修改。

```javascript
const onClick = () => { 
    let list =[...todos]
    list[0].a=3
    setTodos(list);
}
```

简单讲就是React要求useState 和 useReducer等这些hook 在update state的时候要返回一个新的 reference。

# immutable.js 的实现原理

## 可变与不可变

可变数据的副作用

因为 js 分为原始类型和引用类型

所以在引用类型在使用过程中经常会产生副作用

## 不可变数据的解决方案

浅复制 object.assign 或者 ... 对引用类型进行浅复制

``` js
const person = [{
    name: 'Messi'
}];
const person1 = person.map(item =>
    ({
        ...item,
        name: 'Kane'
    })
)
console.log(person, person1);
// [{name: 'Messi'}] [{name: 'Kane'}]
```

但是这种复制只能复制一层, 在多层嵌套的情况下依然会出现副作用

``` js
const person = [{
    name: 'Messi',
    info: {
        age: 30
    }
}];
const person1 = person.map(item =>
    ({
        ...item,
        name: 'Kane'
    })
)
console.log(person[0].info === person1[0].info); // true
```

上诉代码表明当利用浅复制产生新的依然会出现共用同一堆内存的问题.

## 深度克隆

  我们可以从现有的深度克隆库加入进去, 不过这样性能开销很大.

## immutable.js

  而 immutable 则是兼顾了使用效果和性能的解决方案
  persistent data structure(持久化数据结构), 对 immutable 对象的任何修改或添加删除操作都会返回一个新的 immutable 对象, 同时使用旧数据创建新数据时, 要保证旧数据同时可用且不变

为了避免向 deepCopy 一样把所有节点都复制一遍带来的性能损耗, immutable 使用了 structural sharing(结构共享), 即如果对象树中一个节点发生变化, 只修改这个节点和受它影响的父节点, 其他节点则进行共享.

## 自己实现一个 immutable

  原生 js 的 api 来实现一个 immutable, 很显然我们需要对引用对象的 set, get, delete等一系列操作的特性进行修改, 这就需要 defineProperty 或者 Proxy 进行元编程.

  我们就以 proxy 为例来进行编码. 我们在外部对目标对象进行修改的时候来进行额外操作保证数据的不可变.
  在外部对目标对象进行修改的时候, 我们可以将被修改的引用的那部分进行拷贝,这样即能保证效率又能保证可靠性

1. 我们维护一个状态,判断目标对象是否被修改过.

```js
function createState(target) {
    this.modified = false; // 是否被修改
    this.target = target; // 目标对象
    this.copy = undefined; // 拷贝的对象
  }

```

1. 根据不用状态来进行不同的操作

```js
createState.prototype = {
    // 对于get操作,如果目标对象没有被修改直接返回原对象,否则返回拷贝对象
    get: function(key) {
      if (!this.modified) return this.target[key];
      return this.copy[key];
    },
    // 对于set操作,如果目标对象没被修改那么进行修改操作,否则修改拷贝对象
    set: function(key, value) {
      if (!this.modified) this.markChanged();
      return (this.copy[key] = value);
    },
    // 标记状态为已修改,并拷贝
    markChanged: function() {
      if (!this.modified) {
        this.modified = true;
        this.copy = shallowCopy(this.target);
      }
    },
  };
  // 拷贝函数
  function shallowCopy(value) {
    if (Array.isArray(value)) return value.slice();
    if (value.__proto__ === undefined)
      return Object.assign(Object.create(null), value);
    return Object.assign({}, value);
  }
```

```js
const PROXY_STATE = Symbol('proxy-state');
  const handler = {
    get(target, key) {
      if (key === PROXY_STATE) return target;
      return target.get(key);
    },
    set(target, key, value) {
      return target.set(key, value);
    },
  };
  // 接受一个目标对象和一个操作目标对象的函数
  function produce(state, producer) {
    const store = new createState(state);
    const proxy = new Proxy(store, handler);
    producer(proxy);
    const newState = proxy[PROXY_STATE];
    if (newState.modified) return newState.copy;
    return newState.target;
  }
```

createState 接受目标对象 state 生成对象 store,然后我们就可以用 proxy 代理 store, producer 是外部传经来的操作函数, 当 producer 对代理对象进行操作的时候我们就可以通过事先设定好的 handler 进行代理操作了
