# Context


## childContextType

```js
class Child2 extends React.Component {
  render() {
    return (
      <p>
        childContext: {this.context.value} {this.context.a}
      </p>
    )
  }
}

Parent.childContextTypes = {
  value: PropTypes.string,
  a: PropTypes.string,
}

Parent2.childContextTypes = {
  a: PropTypes.string,
}

```

## createContext

```js
const { Provider, Consumer } = React.createContext('default')


function Child1(props, context) {
  console.log(context)
  return <Consumer>{value => <p>newContext: {value}</p>}</Consumer>
}
Child1.contextTypes = {
  value: PropTypes.string,
}

//Parent
        <Provider value={this.state.newContext}>{this.props.children}</Provider>

```

个人的建议是对所有组件共享的一些只读信息可以采用 context 来传递，比如登录用户信息
等， react Router 路由就是通过 context 来传递路由属性的。






