


# 自定义hooks 返回jsx时， 这个自定义的hooks吗和函数式组件没什么区别

hooks特别擅长用来实现状态行为的复用，如果你的li组件里面仅仅用来渲染数据，并没有与其它组件相复用的状态逻辑，那么还是建议使用component，毕竟组件可以直接声明在jsx中，而hooks必须手动调用。

只能在顶层调用hooks 语句，不能在循环 嵌套 条件语句

# 自定义组件里获取文件数据, 如果hook组件里点了删除, 如何让自定义组件里的数据重新获取更新

比如数据由A模块来维护，那么无论谁想修改数据，都要通知A模块，由A模块代为完成，这样数据变更的状态就比较好跟踪了。

你可以这样理解，Hook只向父组件回调函数，具体删数据还是刷新数据都是父组件来操作。

其实useLayoutEffect的调用时机与之前的componentDidMount/componentDidUpdate是相同的，都是发生在DOM更新之后，会阻塞渲染。而getSnapshotBeforeUpdate是发生在重渲染之前，因此可以记录一些DOM的状态。

到目前位置，React Hooks还没有提供与getSnapshotBeforeUpdate等价或者类似的Hook函数。

```js
function Example () {
  const [count, setCount] = useState(0);

  const update = useUpdate()
  console.log(update, '是否更新')

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => {setCount(count+1)}}>+</button>
    </div>
  )
}

function useUpdate () {
  const ref = useRef(false)
  useEffect(() => {
    ref.current = true
  })
  return ref.current
}
```