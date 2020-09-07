

## 详解




## 实例

```js
//from action.js
const LIKE = (id) => ({
     type: "LIKE",
     id:id
})

reqLike({id:id}).then(res =>{ dispatch(LIKE(id))})

```

使用后

```js
//from action.js
const LIKE = (id) => {
    return function (dispatch,getState) {
        reqLike({id:id}).then(res =>{
            dispatch({
                type: "LIKE",
                id:id
            })
        })
    }
}

dispatch(LIKE(id))
```

## 原理解析

```js
export default function applyMiddleware(...middlewares) {
  //这个返回函数就是enhancer
  return (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)
    let dispatch = store.dispatch
    let chain = []

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
```

在 redux 源码中的 createStore 函数中, enchancer 被执行,传入参数createStore，又紧接着执行其返回的函数，传入reducer和preloadedState.

```js
if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }
    return enhancer(createStore)(reducer, preloadedState)
}
```

在 redux-thunk 源码中

```js
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    //这里返回的函数就是chain
    return function (next) {
    //这里返回的函数就是改写的dispatch
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
```

从源码我们可以看出，chain就是以next作为形参的匿名函数，至于compose只是不断传递每个函数的返回值给下一个执行函数，然后依次去执行它所有传入的函数而已，它源码中的注释说的很清楚:For example, compose(f, g, h) is identical to doing (...args) => f(g(h(...args))).


```js
function (action) {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    //next为之前传入的store.dispatch,即改写前的dispatch
    return next(action);
};


```

redux-thunk实现了相关异步流程内聚到redux的流程中，实现middleware的功能，也便于项目的开发与维护，避免冗余代码。而实现的方式便是改写redux中的dispatch API，使其可以除PlainObject外，接受一个函数作为参数。