
# redux-thunk

## 详解

  用于处理异步的 action, 因为 dispatch 的默认参数只能是一个 JavaScript 对象.
  如果先派发一个发送请求的 action, 在派发一个处理请求结果的 action

``` js
dispatch(sendRequestAction);
dispatch(handleResponseAction);
```

如果可以接收一个函数作为参数, 在函数体内进行异步操作, 并在异步完成后在派发相应的 action, 那么便能解决问题

``` js
store.dispatch(fetchNewBook(’learnRedux’));

function fetchNewBook(book) {
    return function(dispatch) {
        dispatch({
            type: 'START_ FETCH_NEW_BOOK',
            data: book
        })
        ajax({
                url( `／ some/API/$(book } . ] son ` ,
                    type POST『， data: {}
                }).then(function(bookData) {
                dispatch({
                    type: 'FETCH_NEW_BOOK_SUCCESS',
                })
            })
        }
    }
```

![redux-thunk](https://tva1.sinaimg.cn/large/007S8ZIlgy1gircrpw14jj30po0bataw.jpg)


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