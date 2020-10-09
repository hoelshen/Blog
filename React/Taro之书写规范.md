# taro 规范
Taro 中普通 JS/TS 文件以小写字母命名，多个单词以下划线连接，例如 util.js、util_helper.js
Taro 组件文件命名遵循 Pascal 命名法，例如 ReservationCard.jsx

对于变量和函数名统一使用驼峰命名

避免对类名重新赋值

子类的构造器一定要调用super

使用this 前请确保super（）已调用

组件 与jsx 书写规范
jsx 属性均使用单引号

## 属性名称始终使用驼峰命名法

jsx 与括号

书写顺序：
1. static 静态方法
2. constructor
3. componentWillMount
4. componentDidMount
5. componentWillReceiveProps
6. shouldComponentUpdate
7. componentWillUpdate
8. componentDidUpdate
9. componentWillUnmount
10. 点击回调或者事件回调 比如 onClickSubmit() 或者 onChangeDescription()
11. render

```js
this.setState({
  value: this.state.value + 1
})   // ✗ 错误

this.setState(prevState => ({ value: prevState.value + 1 }))    // ✓ 正确

```

## 尽量避免在 componentDidMount 中调用 this.setState

因为在 componentDidMount 中调用 this.setState 会导致触发更新

 尽量避免，可以在 componentWillMount 中处理

不要在调用 this.setState 时使用 this.state  
由于 this.setState 异步的缘故，这样的做法会导致一些错误，可以通过给 this.setState 传入函数来避免

不要在 componentWillUpdate/componentDidUpdate/render 中调用 this.setState

组件最好定义 defaultProps
  static defaultProps = {
    isEnable: true
  }

render 方法必须有返回值

值为 true 的属性可以省略书写值

```js
<Hello personal />
<Hello personal={false} />
```

JSX 属性或者表达式书写时需要注意空格

```js
<Hello name={ firstname } />   // ✗ 错误
<Hello name={ firstname} />   // ✗ 错误
<Hello name={firstname } />   // ✗ 错误
<Hello name={{ firstname: 'John', lastname: 'Doe' }} />      // ✓ 正确
```

在 Taro 中所有默认事件如 onClick、onTouchStart 等等，均以 on 开

不能使用 Array#map 之外的方法操作 JSX 数组

```js
numbers.filter(isOdd).map((number) => <View />)

for (let index = 0; index < array.length; index++) {
  // do you thing with array
}

const element = array.map(item => {
  return <View />
})
```
