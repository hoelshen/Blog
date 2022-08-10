# 浅析 styled-components

## 使用 ES6 的字符串模板

webComponent 的概念出现了。其中最出名的是custom Element
什么是 custom element
我们可以自定义html Element

```jsx
class HelloCustomElement extends HTMLElement {}
customElements.define('hello-custom-element', HelloCustomElement);
```

使用

```js
<hello-custom-ele>
  <h1>Original H1</h1>
</hello-custom-ele>
```

看起來什麼事情都沒發生，就像是亂寫一個 HTML tag 而已，那個 h1 還是正常的顯示出來，但是其實 <hello-custom-ele> 已經是一個可以客製行為的 html 元件，我們來驗證一下：

```js
class HelloCustomElement extends HTMLElement {
  constructor() {
    super()
    debugger
  }
}
```

## CSS in JS

  使用 styled 变量中包含的函数可以表示所有已知的 HTML 元素

```js
import styled from 'styled-components;

const Title = styled.h1`
  font-size: 18px;
`;
<Title>I'm styled and I know it!</Title>
```

 需要注意的是只有 React 可以使用 Styled-Components

## Props

```jsx
const Button = styled.button`
  background: ${props => props.primary ? 'green' : 'gray'};
`;

<Button primary>Click me!</Button>

```
  
  模板字符串中用箭头函数提供 props 变量.你可以给 css 样式传入任意值.

```jsx
import styled, { css } from 'styled-components;

const Position = styled.div`
  position: absolute;  ${({ side, value }) => css`
    ${side}: ${value};
  `}
`;

<Position side="right" value="50%">
  I'm positioned!
</Position>

```

## CSS 代码片段

```jsx
const underlineOnHover = css`
  text-decoration: none;  
  :hover {
    text-decoration: underline;
  }
`;

const Link = styled.a`
  color: green;
  ${underlineOnHover};
`;
```

## styled-components 用法

```js
import styled from 'styled-components';
import styles from './style.less';

const Wrapper = styled(div)`
  border: 1px dashed ${props => props.color};
  width: 100%;
`;

const Header = (props) => {
  return (
    <div>
      {/* 直接看 jsx，看不出来 Wrapper 的原始标签是 div */}
      <Wrapper color="#fff">使用 styled-component </Wrapper>
      <div className={styles.Wrapper}>使用 CSS Modules</div>
    </div>
  );
};
```

## styled-components 有如下优点

1. 样式写在 js 文件里，降低 js 对 css 文件的依赖.
1. 样式可以使用变量，更加灵活。
1. SSR 类框架处理 CSS Modules 变量相当棘手，所以使用 styled-components 作方案

## 使用技巧

* 避免过度组件化
使用 Styled-component 的原因是想通过它对样式进行组件化,避免像传统 css 那样的全局污染.

* 嵌套元素
不能创建一个返回超过一个 HTML 子元素的 Styled-component 组件. 我们需要对复杂组件,进行拆分.
