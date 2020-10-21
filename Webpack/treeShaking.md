tree-shaking的消除原理是依赖于ES6的模块特性。

依赖关系是可以确定的
 * 只能作为模块顶层的语句出现

 * import 的模块名只能是字符串常量

 * import binding 是 immutable的
  
以来关系是确定， 和运行时的状态无关， 可以进行可靠的静态分析， 然后进行消除
