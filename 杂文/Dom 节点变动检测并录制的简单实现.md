MutationObserver

MutationObserver使用来监测某个范围内DOM的变动，如节点的增减、属性的变动，文本节点的变化等。相当于DOM的改变就会触发MutationObserver这个事件，但是这个事件是异步触发的，会把DOM的变动封装成一个数组进行统一更新的，这点和react中的setState非常相像。

```js
var observer = new MutationObserver(function (mutations, observer) {
  mutations.forEach(function(mutation) {
    console.log(mutation);
  });
})

```











```js
<div id='target' class='block'>

</div>

var target=document.getElementById('target');
var i=0
var observe=new MutationObserver(function (mutations,observe) {
    i++  
});
observe.observe(target,{ childList: true});
target.appendChild(docuemnt. createElement ('span')); 
target.appendChild(docuemnt. createElement ('div'));
console.log(i)

```


录制回放操作的简单实现,
初始思路: 使用 mutationOberver 监听整个页面,每当有页面变动,则将页面的 html 转换成图片进行队列存储, 回放用户操作即不停从队列中取出元素展示


HTML 转 Canvas
```js
html2canvas(document.body).then(function(canvas) {
    document.body.appendChild(canvas);
});
```

Canvas 转 img

上一步生成的 canvas 即为包含目标元素的 canvas 元素对象. 实现保存图片的目标只需要将 canvas 转 image 即可. 通过 canvas 的 toDataURL 方法将 canvas 输出为 data; url 类型的图片 base64地址, 再将该图片地址赋值给元素的 src 属性.


```js

<canvas id="canvas" width="5" height="5">
</canvas>
var canvas = document.getElementById("canvas");
var dataURL = canvas.toDataURL();
console.log(dataURL);


```









