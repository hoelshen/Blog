


## 使用 ES6 的字符串模板




webcomponent的概念出现了。其中最出名的是custom element
什么是custom element
我们可以自定义html elemnt
class HelloCustomElement extends HTMLElement {}
customElements.define('hello-custom-element', HelloCustomElement);

使用
<hello-custom-ele>
  <h1>Original H1</h1>
</hello-custom-ele>

看起來什麼事情都沒發生，就像是亂寫一個 HTML tag 而已，那個 h1 還是正常的顯示出來，但是其實 <hello-custom-ele> 已經是一個可以客製行為的 html 元件，我們來驗證一下：
class HelloCustomElement extends HTMLElement {
  constructor() {
    super()
    debugger
  }
}

