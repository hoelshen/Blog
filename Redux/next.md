# next

## 零配置和使用文件系统作为 api



```js

export default class extends React.Component {
  static async getInitialProps ({req}) {
  return req ? {userAgent: req.header['user-agent']} : {userAgent: navigator.userAgent}
  }
}
```