
```js
createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware, loggerMiddleware)))
```
每一个dispatch出的action会依次（按照中间件插入的顺序）经过每一个中间件的处理的。
thunkMiddleware是用来处理异步action的，action的类型为函数类型，
而loggerMiddleware只能处理普通的plain object类型的action，
所以顺序上需要在thunkMiddleware之后，等thunkMiddleware将函数类型的action处理转换成plain object类型的action，在发挥作用。


