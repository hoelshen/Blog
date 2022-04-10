# jquery的一些常见操作

## jquery 获取元素

```js
$(this).attr("data-val")
```

## jquery拼接表格

```js
  // 创建dom 并将showFields放入dom
  function getTdValue(){ 
      const tbody = $(targetDom).find("tbody")[0]; 
      const thead = $(targetDom).find("thead")[0];
      const cells = thead.rows.item(0).cells.length;
      const workitem_data = {};
      for(let i=0;i<tbody.rows.length;i++) { 
          for(let j=0;j< cells; j++){
              if($(tbody.rows[i].cells[j]).attr("data-name") == "name"){
                  const workitem_id = $(tbody.rows[i].cells[j]).find('a').attr("id");
                  const title = $(tbody.rows[i].cells[j]).find('a').attr("data-name");
                  const href = $(tbody.rows[i].cells[j]).find('a').attr("data-src");
                  workitem_data[workitem_id] = {
                      title: title,
                      href: href,
                      workitem_id: workitem_id
                  }
              }
          }
      }
      return workitem_data;
  }
```

## 获取当前元素的上一个/下一个兄弟级元素等元素的方

jQuery.parent(expr)，找父亲节点，可以传入expr进行过滤，比如$("span").parent()或者$("span").parent(".class")

jQuery.parents(expr)，类似于jQuery.parents(expr),但是是查找所有祖先元素，不限于父元素

jQuery.children(expr)，返回所有子节点，这个方法只会返回直接的孩子节点，不会返回所有的子孙节点

jQuery.contents()，返回下面的所有内容，包括节点和文本。这个方法和children()的区别就在于，包括空白文本，也会被作为一个jQuery对象返回，children()则只会返回节点

jQuery.prev()，返回上一个兄弟节点，不是所有的兄弟节点

jQuery.prevAll()，返回所有之前的兄弟节点

jQuery.next()，返回下一个兄弟节点，不是所有的兄弟节点

jQuery.nextAll()，返回所有之后的兄弟节点

jQuery.siblings()，返回兄弟姐妹节点，不分前后

jQuery.find(expr)，跟jQuery.filter(expr)完全不一样：

jQuery.filter()，是从初始的jQuery对象集合中筛选出一部分，而

jQuery.find()，的返回结果，不会有初始集合中的内容，比如$("p").find("span")，是从<p>元素开始找<span>，等同于$("p span")
