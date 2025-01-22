写了这么久 react 还是会面临 情况

```tsx
function ModalWidget({ options }: { options: IDialogOptions }) {
  return <div>123</div>;
}

const PromptDialog = ({ getValue, placeholder, defaultValue }: IProps) => {};
```

```tsx
const MyComponent = React.FC((props) => {
  return <div>Hello, {props.name}</div>;
});
```

React.FC 会有一些问题

```tsx
const App: React.FunctionComponent<{ message: string }> = ({ message }) => (
  <div>{message}</div>
);
```

2.React.FC 包含了 PropsWithChildren 的泛型，不用显式的声明 props.children 的类型。React.FC<> 对于返回类型是显式的，而普通函数版本是隐式的（否则需要附加注释）。

我们使用 React.FC 来写 React 组件的时候，是不能用 setState 的，取而代之的是 useState()、useEffect 等 Hook API。

````tsx
const SampleModel: React.FC<{}> = () =>{   //React.FC<>为typescript使用的泛型
  	const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  	return {
  	{/** 触发模态框**/}
  	<Button style={{fontSize:'25px'}}  onClick={()=>handleModalVisible(true)} >样例</Button>
  	{/** 模态框组件**/}
  	<Model onCancel={() => handleModalVisible(false)} ModalVisible={createModalVisible} />
  }
```
Thanks all for the answers. They are correct but I was looking for a more detailed version. I did some more research and found this on React+TypeScript Cheatsheets on GitHub.

谢谢你的回答。他们是正确的，但我正在寻找一个更详细的版本。我做了更多的研究，在 GitHub 上的 React + TypeScript 备忘录上找到了这个。

Function Components
功能组件

These can be written as normal functions that take a props argument and return a JSX element.
这些函数可以写成普通函数，它们接受一个 props 参数并返回一个 JSX 元素。

type AppProps = { message: string }; /* could also use interface */

const App = ({ message }: AppProps) => <div>{message}</div>;
What about React.FC/React.FunctionComponent? You can also write components with React.FunctionComponent (or the shorthand React.FC):

那么 React.FC/React. FunctionComponent 呢? 您也可以使用 React.FunctionComponent (或者简写 React.FC)来编写组件:

const App: React.FC<{ message: string }> = ({ message }) => (
  <div>{message}</div>
);
Some differences from the "normal function" version:

与“正常函数”版本的一些不同之处:

It provides typechecking and autocomplete for static properties like displayName, propTypes, and defaultProps - However, there are currently known issues using defaultProps with React.FunctionComponent. See this issue for details - scroll down to our defaultProps section for typing recommendations there.

它提供了类型检查和自动完成的静态属性，如 displayName，protype，和 defaultProps-但是，目前已知的问题使用 defaultProps 和 React。函数组件。有关详细信息，请参阅这个问题-向下滚动到 defaultProps 部分，在那里输入建议。
Provides an implicit definition of children, even if your component doesn't need to have children. That might cause an error.
提供子级的隐式定义，即使您的组件不需要子级。这可能会导致错误。
Doesn't support generics.
不支持泛型。
Doesn't work correctly with defaultProps.
````
