



所有的静态资源都是get请求






如果三方框架是基于老的“template”模版封装的组件开发，则性能并不会有明显改善，其diff对比范围依然是page页面级的。



path-to-regexp 模块是路由实现的核心。



携带具名参数的方法，在调用时如果不传递对应参数也必须传递一个空的大空号，否则内部参数使用时会抛出 undefined


1.为防止这种每次调用都必须传递一对空的大空号的麻烦，可以对方法进行二次封装
export function error (message, position) {
  common(message, 'error', { position })
}


























