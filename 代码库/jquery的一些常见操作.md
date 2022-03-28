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



