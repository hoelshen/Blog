# 拖拽


Drag Source 指的是被點擊要拖曳的物件，也就是藍色的圓，通常是一個 element
Drop Target 指的是拖曳的物件被放置的區域，也就是右邊的綠色區域，通常是一個 div container

## 事件
Drag Source	 | Drop Target
---- | ---
dragstart | &nbsp;
drag |  dragenter
&nbsp; |  dragenter
&nbsp; |  dragover
&nbsp; |  dragleave
&nbsp; |  drop
dragend |

drag：在 drag source 被拖曳時會持續被觸發。
dragover：當拖曳的 drag source 在 drop target 上方時會持續被觸發。

### css Style

針對要被拖曳的元素（Drag Source）可以透過 CSS 的屬性設定，避免讓使用者在拖曳該元素時選取到裡面的內容：

```css
[draggable="true"] {
  /*
   To prevent user selecting inside the drag source
  */
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

```

### HTML Attribute

針對能夠被拖曳的元素，在其 HTML 標籤上添加屬性 draggable="true"：

```html
<div id="drag-source" draggable="true"></div>
```

## js

針對要被拖曳的元素（dragSource） 監聽 dragstart 事件，並且把要傳遞給 dropTarget 的資料透過 setData 加以設定：

```js
let dragSource = document.querySelector('#drag-source')
dragSource.addEventListener('dragstart', dragStart)

function dragStart (e) {
  console.log('dragStart')
  e.dataTransfer.setData('text/plain', e.target.id)
}
```

針對要被置放的容器 dropTarget 監聽 drop 事件，來處理當使用者放掉的時候要執行的行為，並透過 getData 來取得傳遞的資料；監聽 dragenter 和 dragover 事件來避免預設行為：

```js
let dropTarget = document.querySelector('#target-container')
dropTarget.addEventListener('drop', dropped)
dropTarget.addEventListener('dragenter', cancelDefault)
dropTarget.addEventListener('dragover', cancelDefault)

function dropped (e) {
  console.log('dropped')
  cancelDefault(e)
  let id = e.dataTransfer.getData('text/plain')
  e.target.appendChild(document.querySelector('#' + id))
}

function cancelDefault (e) {
  e.preventDefault()
  e.stopPropagation()
  return false
}


```