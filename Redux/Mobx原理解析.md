# 


## mobx 原理解析


## provider 源码分析

```js
var MobXProviderContext =
/*#__PURE__*/
React__default.createContext({});
function Provider(props) {
  var children = props.children,
      stores = _objectWithoutPropertiesLoose(props, ["children"]); // 获取除去children后的props对象

  var parentValue = React__default.useContext(MobXProviderContext);
  // `useRef`返回一个可变的 ref 对象，其`.current`属性被初始化为传入的参数（`initialValue`）。返回的 ref 对象在组件的整个生命周期内保持不变。
  var mutableProviderRef = React__default.useRef(_extends({}, parentValue, {}, stores));
  var value = mutableProviderRef.current;

  if (process.env.NODE_ENV !== "production") {
    var newValue = _extends({}, value, {}, stores); // spread in previous state for the context based stores


    if (!shallowEqual(value, newValue)) {
      throw new Error("MobX Provider: The set of provided stores has changed. See: https://github.com/mobxjs/mobx-react#the-set-of-provided-stores-has-changed-error.");
    }
  }

  return React__default.createElement(MobXProviderContext.Provider, {
    value: value
  }, children);
}
Provider.displayName = "MobXProvider";



```