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

纯函数组件 connect 需要是一个forwardRef，像这样：const connect = forwardRef(() => {...})
怎么获取到ref

```ts
export default function forwardRef<Props, ElementType: React$ElementType>(
  render: (props: Props, ref: React$Ref<ElementType>) => React$Node,
){ 
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
  };
}
```

我们通过forwardRef创建的组件 她的 $$typeof 还是 REACT_CREATE_ELEMENT_TYPE,
而 type 则是 REACT_FORWARD_REF_TYPE