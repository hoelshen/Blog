# 组合 vs 继承

## 包含关系

有些子组件无法提前知晓具体内容, 在 sidebar 和 dialog 等展示通用容器的组件中特别容易遇到这种情况

``` js
function FancyBorder(props) {
    return ( <
        div className = {
            'FancyBorder FancyBorder-' + props.color
        } > {
            props.children
        } <
        /div>
    );
}
```

这使得别的组件可以通过 JSX 嵌套，将任意组件作为子组件传递给它们。

``` js
function WelcomeDialog() {
    return ( <
        FancyBorder color = "blue" >
        <
        h1 className = "Dialog-title" >
        Welcome <
        /h1> <
        p className = "Dialog-message" >
        Thank you
        for visiting our spacecraft!
        <
        /p> <
        /FancyBorder>
    );
}
```

我们也可以 将所需内容传入 props. 并使用相应的 prop

```js
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

\<Contacts /> 和 \<Chat /> 之类的 React 元素本质就是对象（object），所以你可以把它们当作 props，像其他数据一样传递。
