#  使用方式

1. string 
2. function
3. createRef

```js
export function createRef(): RefObject {
  const refObject = {
    current: null,
  };
  if (__DEV__) {
    Object.seal(refObject);
  }
  return refObject;
}

```

purecomponent 没有实例

纯函数组件
connect需要是一个forwardRef，像这样：const connect = forwardRef(() => {...})
怎么获取到ref

```ts
const LazyComp = lazy(() => import('./lazy.js'))


export default () => (
  <Suspense fallback="loading data">
    <SuspenseComp />
    <LazyComp />
  </Suspense>
)


import React from 'react'

export default () => <p>Lazy Comp</p>

```


```js
import type {LazyComponent, Thenable} from 'shared/ReactLazyComponent';

import {REACT_LAZY_TYPE} from 'shared/ReactSymbols';

export function lazy<T, R>(ctor: () => Thenable<T, R>): LazyComponent<T> {
  return {
    $$typeof: REACT_LAZY_TYPE,
    _ctor: ctor,
    // React uses these fields to store the result.
    _status: -1,
    _result: null,
  };
}


```
