## TypeScript内置的工具类型 Record

```TypeScript
// type Record<K extends string | number | symbol, T> = { [P in K]: T; }
interface Developer extends Record<string, any> {
  name: string;
  age?: number;
}

let developer: Developer = { name: "semlinker" };
developer.age = 30;
developer.city = "XiaMen";
```

## TS源码是怎么定义Record的

```ts
type Record<K extends keyof any, T> = { [P in K]: T; };
```

```ts
type res = keyof any;
```

需要约束某个类型参数为索引 Key 时，用 keyof any 动态获取比写死 string | number | symbol 更好

## object 和 Record<string, any>

TypeScript 里有三个类型比较难区分，就是 object、Object、{} 这几个。

其实只要记住 object 不能接受原始类型 就可以了，其余两个差不多，只不过 {} 是个空对象，没有索引。

所以 number 就可以赋值给 {}、Object 类型，但是不能赋值给 object 类型：

```TS
type res = number extends object ? true : false;
**type res= false**

type res = number extends {} ? true : false;
**type res= true**


type res = number extends Object ? true : false;
**type res= true**

```

我们发现大家都不用 object 来约束，而是用 Record<string, any> 来约束索引类型，这俩其实是一样的，但是 Record<string, any> 更语义化一些。

Record<string, any> 创建了一个 key 为任意 string，value 为任意类型的索引类型：

```TS
type res = Record<string, any>
**
type res = {
    [x: string]: any;
}
**
```

平时约束索引类型的时候就可以用 Record<string, any> 代替 object。
