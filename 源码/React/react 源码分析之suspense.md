


## 



## 更新

```js
export type SuspenseState = {|
  alreadyCaptured: boolean,
  didTimeout: boolean,
  timedOutAt: ExpirationTime,
|}
```


```js
if (finishedWork.effectTag & Callback) {
  const newState: SuspenseState = {
    alreadyCaptured: true,
    didTimeout: false,
    timedOutAt: NoWork,
  }
  finishedWork.memoizedState = newState
  scheduleWork(finishedWork, Sync)
  return
}
```