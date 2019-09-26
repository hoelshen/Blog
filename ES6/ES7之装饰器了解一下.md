# es7之装饰器

刚好最近在弄typescript ，很多用到装饰器 所以就从基础开始看起 在对typescript做一个研究

## 基础环境配置
  
  1. yarn add @babel/cli -g
  2. 创建.babelrc
  3. yarn add @babel/plugin-proposal-class-properties --save-dev
  4. yarn add @babel/plugin-proposal-decorators --savde-dev
  5. yarn add @babel/preset-env --savde-dev

## 常规操作

``` javascript
class Decoration {
    constructor() {
        this.keyValue = ""
    }
    @statement // 装饰器命名
    url = 'aaa'; //被装饰的属性
    agent() {
        console.log(this.url, '-------------', this.keyValue);
    }
}

function statement(proto, key, descriptor) {
    console.log('sdsdsd', proto, key, descriptor);
    descriptor.writable = false; //被装饰属性不可写
}
```

## 对属性做装饰

``` javascript
class Decoration {
    constructor() {
        this.value = ""
    }
    @statement // 装饰器命名
    url = 'sjh'; //被装饰的属性
    agent() {
        console.log(this.url, '+++', this.value);
    }
}

function statement(proto, key, descriptor) {
    console.log('sdsdsd', proto, key, descriptor);

    descriptor.writable = true
    // console.log(descriptor.initializer()) //被装饰的属性值；装饰私有属性特有的一个属性

    descriptor.initializer = function() {
        return 'url的值被修改了'
    }
}

var os = new Decoration();
console.log(os.agent());

// 解析 输出
{
    constructor: ƒ,
    agent: ƒ
}
url {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: ƒ
}
url的值被修改了-- -- --undefined
statement装饰器作用于 url
我们定义的function statement有个 initializer方法 将值做了修改
initializer 由babel内部是用来创建对象属性的属性描述符
```

## 对原型做装饰

``` javascript
class Decoration {
    constructor() {
        this.value = "";
    }
    url = '1'
    @pro //装饰原型方法
    agent() {
        console.log(this.url + "++" + this.value);
    }
}

function pro(proto, key, descriptor) {
    console.log(proto, key, descriptor) //打印结果如下;
    let oldValue = descriptor.value //被装饰的函数
    descriptor.value = function() {
        console.log('被装饰的函数重写')
    }
}

var os = new Decoration();
os.agent()

输出： {
    constructor: ƒ,
    agent: ƒ
}
"agent" {
    value: ƒ,
    writable: true,
    enumerable: false,
    configurable: true
}
被装饰的函数重写
```

## 装饰类

``` javascript
class Decoration {
    constructor() {
        this.value = "";
    }
    @skin
    agent() {
        console.log(this.value + "----------" + this.age);
    }
}

function skin(traget) {
    traget.age = '18' //添加一个属性age并赋值18
}

var os = new Decoration();
os.agent();

输出 this.age
```

## 实现proxy劫持

``` javascript
class C {
    constructor() {
        this.children = '1'
    }
    @enumerable(false)
    get method() {
        return this.children.length;
    }
}

function enumerable(value) {
    return function(target, key, descriptor) {
        descriptor.enumerable = value;
        return descriptor;
    }
}

var c = new C();
c.method();
```

## 实现一个memoized方法

```javascript
class Person {
  @memoize
  get name() { return `${this.first} ${this.last}` }
  set name(val) {

    let [first, last] = val.split(' ');
    this.first = first;
    this.last = last;

  }
}

let memoized = new WeakMap(); 
function memoize(target, name, descriptor) {
  let getter = descriptor.get, setter = descriptor.set; 

  descriptor.get = function() {

    let table = memoizationFor(this);
    if (name in table) { return table[name]; }
    return table[name] = getter.call(this);

  }

  descriptor.set = function(val) {

    let table = memoizationFor(this);
    setter.call(this, val);
    table[name] = val;

  }
}

function memoizationFor(obj) {
  let table = memoized.get(obj); 
  if (!table) { table = Object.create(null); memoized.set(obj, table); }
  return table; 
}

```

## 装饰器在TypeScript中的运用

``` typescript
装饰是一种特殊种类的声明可被作用于一个类声明、方法、访问器，属性或参数。
function f() {
  console.log("f(): evaluated");
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("f(): called");
  }
}

function g() {
  console.log("g(): evaluated");
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("g(): called");
  }
}

class C {
  @f()
  @g()
  method() {}
}
```

## typescript 要注意的点

注意TypeScript不允许为单个成员装饰get和set访问器。相反，成员的所有装饰器必须应用于以文档顺序指定的第一个访问器。这是因为装饰器适用于属性描述符，该属性描述符组合了访问器get和set访问器，而不是单独的每个声明。

```typescript
class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() { return this._x; }

  @configurable(false)
  get y() { return this._y; }
}

function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}
```

## 装饰器不能用于函数

```typescript

var counter = 0;

var add = function() {
    counter++;
};

@add
function foo() {}
```

函数提升下会变成

```javascript
@add

function foo() {}

var counter;
var add;

counter = 0;

add = function() {
    counter++;
};
```

