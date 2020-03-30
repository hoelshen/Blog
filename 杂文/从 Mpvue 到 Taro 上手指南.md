# 前文
  因为自己有小程序和 React 的相关经验，最近上手了一下Taro，但是小程序一直是用vue 相关的框架写的，所以还是感到他们之间的区别。
其实是从vue 转变为react

## 相同

### 生命周期对比

Taro官方是基于16之前，所以一些生命周期还是保留下来。
```对比下react 官网 的生命周期
挂载
当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：
* constructor()
* static getDerivedStateFromProps()
* render()
* componentDidMount()

componentwillMount 将被舍弃

更新
当组件的 props 或 state 发生变化时会触发更新。组件更新的生命周期调用顺序如下：
* static getDerivedStateFromProps()
* shouldComponentUpdate()
* render()
* getSnapshotBeforeUpdate()
* componentDidUpdate()


卸载
当组件从 DOM 中移除时会调用如下方法：
* componentWillUnmount()


舍弃了：  
  * componentWillMount，是当组件在进行挂载操作前，执行的函数，一般紧跟着 constructor 函数后执行
  * componentWillReceiveProps，当组件收到新的 props 时会执行的函数，传入的参数就是 nextProps ，你可以在这里根据新的 props 来执行一些相关的操作，例如某些功能初始化等
  * componentWillUpdate，当组件在进行更新之前，会执行的函数

```js
离开的顺序： index的跳转方法  后面跟着componentdDidHide

进入的顺序： componentWillMount  componentDidShow  componentDidMount


```

## 区别

### 事件点击方式


```js
当你通过 bind 方式向监听函数传参，在类组件中定义的监听函数，事件对象 e 要排在所传递参数的后面。
class Popper extends Component {
  constructor () {
    super(...arguments)
    this.state = { name:'Hello world!' }
  }

  // 你可以通过 bind 传入多个参数
  preventPop (name, test, e) {    //事件对象 e 要放在最后
    e.stopPropagation()
  }

  render () {
    return <Button onClick={this.preventPop.bind(this, this.state.name, 'test')}></Button>
  }
```
### Mpvue中的filter, Taro有吗
```js


```
### 项目配置
  Taro 有专门的config 配置文件，里面的配置项还是很丰富的。以下是部分配置项

```js
  deviceRatio: {
    '375': 1 / 2,
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  alias: {
    '@/utils': path.resolve(__dirname, '../src/utils'),
    '@/components': path.resolve(__dirname, '../src/components'),
    '@/servers': path.resolve(__dirname, '../src/servers'),
    '@/assets': path.resolve(__dirname, '../src/assets'),
    '@/constants': path.resolve(__dirname, '../src/constants')
  },

```

### api
首先是api 的命名方式不同， 在 Taro 里面没有wx，这个api开头，所有的一切都要转变成Taro,可以看下面这个例子:
```js
    Taro.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        Taro.showLoading({
          title: '上传中',
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePath = res.tempFilePaths[0];
        const name = Math.random() * 1000000;
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
        Taro.$upload(cloudPath, filePath);
      },fail: e => {
        console.error('[上传图片] 失败：', e)
      },
      complete: () => {
        Taro.hideLoading()
      }
    })
```

微信提供的回调是bindgetuserinfo，但是Taro将bind事件都封装成了on事件，这个需要注意一下

### ref
  Trao 给了三种 ref 调用方式，
```js
    const refDay = (node) => this.MDay = node //  `this.MDay` 会变成 `MDay` 组件实例的引用
    const refDialog = (node) => this.MDialog = node //  `this.MDialog` 会变成 `MDialog` 组件实例的引用



```

### slot

跟vue 不同的点。不允许在jsx 参数中传入jsx元素
不能使用内置组件化的slot 功能

```jsx
//无效
<Custom child={<View />} />

<Custom child={() => <View />} />

<Custom child={function () { <View /> }} />

<Custom child={ary.map(a => <View />)} />
```

解决方案
通过 props 传值在 JSX 模板中预先判定显示内容，或通过 props.children 来嵌套子组件。
小程序端不要在组件中打印传入的函数
this.props.onXxx && this.props.onXxx() 这种判断函数是否传入来进行调用的写法是完全支持的。

```jsx
render () {
  // 增加一个兼容判断
  return this.state.abc && <Custom adc={abc} />
}
```
在微信小程序中，从调用 Taro.navigateTo、Taro.redirectTo 或 Taro.switchTab 后，到页面触发 componentWillMount 会有一定延时。因此一些网络请求可以提前到发起跳转前一刻去请求。
 

## 优化

下面是官网摘录的相关优化方式:
1. 不要直接更新状态

2. 状态更新一定是异步的
  Taro 可以将多个 setState() 调用合并成一个调用来提高性能。
  因为 this.state 和 props 一定是异步更新的，所以你不能在 setState 马上拿到 state 的值，例如：

```js
假设我们之前设置了 this.state.counter = 0
updateCounter () {
  this.setState({
    counter: 1
  }, () => {
    // 在这个函数内你可以拿到 setState 之后的值
  })
}
```
合并是浅合并，所以 this.setState({comments}) 不会改变 this.state.posts 的值，但会完全替换 this.state.comments 的值。

## css样式

### classname
```js
    const vStyle = classNames({
      playing: true,
      'vStyle-a': id === 'A',
      'vStyle-b': id === 'B',
      'vStyle-c': id === 'C'
    });
    const pStyle = classNames(
      'circle',
      { 'whiteCircle': playState === 'PLAY_START' },
      { 'blueCircle': playState === 'PLAY_LOAD' },
      { 'whiteCircle': playState === 'PLAY_STOP' }
    )

<View className={vStyle}>
    <View className={`${pStyle}`} onClick={this.clickPlay}>
      {Triangle
      ?<Image className='Triangle' src={play}></Image>
      :
      <Image className='Triangle' src={stop}></Image>
      }
</View>


```