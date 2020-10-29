


## 父子组件生命周期

父组件先创建，然后子组件创建；子组件先挂载，然后父组件挂载。

```js
父beforeCreate-> 父create -> 父beforeMount-> 子beforeCreate-> 子beforeCreate-> 子created -> 子mounted -> 父mounted

```

父子组件传递接口数据的解决方案

子组件挂载完成后，父组件还未挂载。所以组件数据回显的时候，在父组件mounted中获取api的数据，子组件的mounted是拿不到的。

仔细看看父子组件生命周期钩子的执行顺序，会发现created这个钩子是按照从外内顺序执行，所以父子组件传递接口数据的解决方案是：

```js
在created中发起请求获取数据，依次在子组件的created或者mounted中会接收到这个数据


```