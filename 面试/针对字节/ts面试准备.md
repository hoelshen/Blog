interface 与 type 异同点

在对象扩展情况下，interface 使用 extends 关键字，而 type 使用交叉类型（&）。
同名的 interface 会自动合并，并且在合并时会要求兼容原接口的结构。
interface 与 type 都可以描述对象类型、函数类型、Class 类型，但 interface 无法像 type 那样表达元组、一组联合类型等等。
interface 无法使用映射类型等类型工具，也就意味着在类型编程场景中我们还是应该使用 type 。