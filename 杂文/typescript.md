# 使用方法

## 类型推论

如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型。

如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查：

```TS
let myFavoriteNumber;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;

```

## 联合类型

联合类型（Union Types）表示取值可以为多种类型中的一种。

```TS
function getLength(something: string | number): number {
  return something.length;
}
```

这样会报错， 因为 someting 没有 number

## 接口

在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。
TypeScript 中的接口是一个非常灵活的概念，除了可用于**对类的一部分行为进行抽象**以外，也常用于对「对象的形状（Shape）」进行描述。

定义的变量比接口少了一些属性是不允许的， 多一些也是不允许的。

```TS

interface IPerson {
    name: string;
    age: number;
}

let tom: IPerson = {
    name: 'Tom',
    age: 25
};
```

可见，赋值的时候，变量的形状必须和接口的形状保持一致。

任意属性

```TS
interface Person {
  name: string;
  age?: number;
  [propName: string]: any;
}

let tom: Person = {
  name: 'Tom',
  gender: 'male',
  SJH: true
};

```

一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集：

```TS

interface Person {
    name: string;
    age?: number;
    [propName: string]: string;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};
```

任意属性的值允许是 string，但是可选属性 age 的值却是 number，number 不是 string 的子属性，所以报错了。

一个接口中只能定义一个任意属性。如果接口中有多个类型的属性， 则可以在任意属性中使用联合类型

```TS
interface Person {
  name: string;
  age?: number;
  [propName: string]: string | number;
}

let tom: Person = {
  name: 'Tom',
  age: 25,
  gender: 'male'
};
console.log("tom", tom);
```

## 接口表示数组

类数组不是数组类型

```TS
function sum() {
    let args: number[] = arguments;
}

// Type 'IArguments' is missing the following properties from type 'number[]': pop, push, concat, join, and 24 more.
```

```TS
function sum() {
    let args: {
        [index: number]: number;
        length: number;
        callee: Function;
    } = arguments;
}
```

我们除了约束当索引的类型是数字时，值的类型必须是数字之外，也约束了它还有 length 和 callee 两个属性。
事实上常用的类数组都有自己的接口定义，如 IArguments, NodeList, HTMLCollection 等：

## 函数表达式

对等号右侧的匿名函数进行了类型定义，而等号左边的 mySum，是通过赋值操作进行类型推论而推断出来的。

```TS
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
```

注意不要混淆了 TypeScript 中的 => 和 ES6 中的 =>。

在 TypeScript 的类型定义中，=> 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。

```TS

interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```

采用函数表达式|接口定义函数的方式时，对等号左侧进行类型限制，可以保证以后对函数名赋值时保证参数个数、参数类型、返回值类型不变。

## 重载

重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | undefined {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

## 类型断言

类型断言（Type Assertion）可以用来手动指定一个值的类型。

值 as 类型 或 <类型>值

将一个联合类型断言为其中一个类型

当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型中**共有的属性或方法**：

```ts
interface Cat {
  name: string;
  run(): void;
}
interface Fish {
  name: string;
  swim(): void;
}

function isFish(animal: Cat | Fish) {
  if (typeof (animal as Fish).swim === 'function') {
      return true;
  }
  return false;
}
```

不确定类型的时候就访问其中一个类型特有的属性或方法, 就会报错， 例如：swim。

使用类型断言时一定要格外小心，尽量避免断言后调用方法或引用深层属性，以减少不必要的运行时错误。

## 将一个父类断言为更加具体的子类

```ts
class ApiError extends Error {
    code: number = 0;
}
class HttpError extends Error {
    statusCode: number = 200;
}

function isApiError(error: Error) {
    if (typeof (error as ApiError).code === 'number') {
        return true;
    }
    return false;
}
```

```ts
interface ApiError extends Error {
    code: number;
}
interface HttpError extends Error {
    statusCode: number;
}

function isApiError(error: Error) {
    if (error instanceof ApiError) {
        return true;
    }
    return false;
}
```

  ApiError 是一个 JavaScript 的类，能够通过 instanceof 来判断 error 是否是它的实例。使用 instanceof 更合适，但如果是接口的话，则不合适。

## 将任何一个类型断言为 any

(window as any).foo = 1;
在 any 类型的变量上，访问任何属性都是允许的。

举例来说，历史遗留的代码中有个 getCacheData，它的返回值是 any：

```ts

function getCacheData(key: string): any {
    return (window as any).cache[key];
}
```

那么我们在使用它时，最好能够将调用了它之后的返回值断言成一个精确的类型，这样就方便了后续的操作：

```ts

function getCacheData(key: string): any {
    return (window as any).cache[key];
}

interface Cat {
    name: string;
    run(): void;
}

const tom = getCacheData('tom') as Cat;
tom.run();
```

上面的例子中，我们调用完 getCacheData 之后，立即将它断言为 Cat 类型。这样的话明确了 tom 的类型，后续对 tom 的访问时就有了代码补全，提高了代码的可维护性。

要使得 A 能够被断言为 B，只需要 A 兼容 B 或 B 兼容 A 即可，这也是为了在类型断言时的安全考虑，毕竟毫无根据的断言是非常危险的。

## 类型断言 vs 类型转换

```ts
function toBoolean(something: any): boolean {
    return something as boolean;
}

toBoolean(1);
```

所以类型断言不是类型转换，它不会真的影响到变量的类型。若要进行类型转换，需要直接调用类型转换的方法：return Boolean(something);

## 类型断言 vs 类型声明

```ts
interface Animal {
    name: string;
}
interface Cat {
    name: string;
    run(): void;
}

const animal: Animal = {
    name: 'tom'
};
let tom: Cat = animal;

// index.ts:12:5 - error TS2741: Property 'run' is missing in type 'Animal' but required in type 'Cat'.
```

animal 断言为 Cat，只需要满足 Animal 兼容 Cat 或 Cat 兼容 Animal 即可
animal 赋值给 tom，需要满足 Cat 兼容 Animal 才行

## 类型断言 vs 泛型

```ts
function getCacheData<T>(key: string): T {
    return (window as any).cache[key];
}

interface Cat {
    name: string;
    run(): void;
}

const tom = getCacheData<Cat>('tom');
tom.run();
```

通过给 getCacheData 函数添加了一个泛型 \<T>，我们可以更加规范的实现对 getCacheData 返回值的约束，这也同时去除掉了代码中的 any，是最优的一个解决方案。

## 声明文件

declare var 并没有真的定义一个变量，只是定义了全局变量 jQuery 的类型，仅仅会用于编译时的检查，在编译结果中会被删除。

```ts
// src/jQuery.d.ts

declare var jQuery: (selector: string) => any;
```

## 类型别名

类型别名用来给一个类型起个新名字。

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}


```

## 字符串字面量类型

```ts
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
    // do something
}

handleEvent(document.getElementById('hello'), 'scroll');  // 没问题
handleEvent(document.getElementById('world'), 'dblclick'); // 报错，event 不能为 'dblclick'
```

注意，类型别名与字符串字面量类型都是使用 type 进行定义。

## 枚举

枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等。

```ts
enum Days {Sun = 7, Mon = 1, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 7); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true
```

## 常数项和计算所得项

枚举项有两种类型：常数项（constant member）和计算所得项（computed member）。

```ts
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员。

## 类

TypeScript 可以使用三种访问修饰符（Access Modifiers），分别是 public、private 和 protected。

public 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的
private 修饰的属性或方法是私有的，不能在声明它的类的外部访问
protected 修饰的属性或方法是受保护的，它和 private 类似，区别是它在子类中也是允许被访问的

## 类与接口

实现（implements）是面向对象中的一个重要概念。一般来讲，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interfaces），用 implements 关键字来实现。这个特性大大提高了面向对象的灵活性。

```js
interface Alarm {
    alert(): void;
}

class Door {
}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}

class Car implements Alarm {
    alert() {
        console.log('Car alert');
    }
}
```

一个类可以实现多个接口：

```js
interface Alarm {
    alert(): void;
}

interface Light {
    lightOn(): void;
    lightOff(): void;
}

class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}
```

## 泛型

泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

```ts
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray<string>(3, 'x'); // ['x', 'x', 'x']
```

## 泛型约束

泛型 T 不一定包含属性 length，所以编译的时候报错了。

这时，我们可以对泛型进行约束，只允许这个函数传入那些包含 length 属性的变量。这就是泛型约束：

```ts
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```

## 泛型接口

```ts
interface CreateArrayFunc {
    <T>(length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

```ts
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc<any>;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

## 接口的合并

接口中的属性在合并时会简单的合并到一个接口中：

```ts
interface Alarm {
    price: number;
}
interface Alarm {
    weight: number;
}
```




## 参考文献

[ts入门教程](https://ts.xcatliu.com/basics/type-assertion.html)
