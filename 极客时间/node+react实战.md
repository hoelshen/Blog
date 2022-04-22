1. 技术栈


2. 数据库


3. 界面地址： 

```code 
https://github.com/Nick930826/juejue-vite-h5
```


Service 就是在复杂业务场景下用于做业务逻辑封装的一个抽象层。


Service 层就是用于数据库的查询，我们尽量将粒度细化，这样以便多个 Controller 共同调用同一个 Service。

中间件的概念就是在路由配置里设置了中间件的路由，每次请求命中后，都要过一层中间件。


你可以每次都在 Controller 判断，当前请求是否携带有效的用户认证信息。接口一多，到处都是这样的判断，逻辑重复。所以，中间件在某种程度上，也算是优化代码结构的一种方式。更加详细的描述请移步至

unction convertChineseWeekday(date) { var weekIndex = date.getDay(); var weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']; return weekdays[weekIndex] || '非法输入';



