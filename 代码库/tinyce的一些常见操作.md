# 常见操作

## 发送 响应

```js
editor.fire('tencentDocAfterCreate', { editor: target, doc });

editor.on('tencentDocAfterCreate', function(data){
    $('body').trigger('tencentDocAfterCreate',data);
});
```

## 获取焦点

```js
      editor.editorManager.get(editor.settings.id).focus() // 获取焦点
      editor.insertContent('') // 获取焦点
```

## 获取编辑器点击的元素

```js
function composedPath(event) {
  if (event.path) {
    return event.path;
  }
  try {
    return event.composedPath();
  } catch (e) {
    const path = [];
    let el = event.target;
    while (el) {
      path.push(el);
      if (el.tagName === 'HTML') {
        path.push(document);
        path.push(window);
        return path;
      }
      el = el.parentElement;
    }
    return path;
  }
}
    editor.on('click', function (event) {
      function getCherryModuleEventInfo(event) {
        let eventflag = '';
        const path = composedPath(event);

        for (let index = path.length - 1; index >= 0; index--) {
          const element = path[index];
          if (!element.getAttribute) {
            continue;
          }

          if (element.getAttribute('cm-eventflag')) {
            eventflag = element.getAttribute('cm-eventflag');
          }
        }
        return {
          eventflag,
        };
      };
      const value = getCherryModuleEventInfo(event);
      const targetDom = getCurrentChooseWorkItemTable();
      if (value.eventflag === 'refreshWorkItemBlock') {
        editor.fire('refreshWorkItemBlockEvent', { editor: editor, workitemBlockNode: targetDom });
      }
    });
```

## 点击的元素是不是含有某个class类

```js
    const isWorkItemBlock = function (dom) {
      if (
        editor.dom.is(dom, "div") &&
        editor.dom.hasClass(dom, "cherry-choose-workitem")
      ) {
        return true;
      }
      return false;
    };
```

## 注册悬浮菜单栏

```js
    editor.addCommand("changeWorkItemBlock", function (ui, type) {
      if (type === void 0) {
        type = defaultType;
      }
    });
    editor.addCommand("showWorkItemBlock", function (ui, { key, targetDom }) {
      if (key == "show") {
        editor.fire("createWorkItemShowFileds", {
          editor: editor,
          workitemBlockNode: targetDom,
        });
      } else if (key == "change") {
        editor.fire("changeWorkItemShowFileds", {
          editor: editor,
          workitemBlockNode: targetDom,
        });
      }
    });

    // 注册bubble menu 按钮组里的具体按钮
    Object.keys(defaultList).forEach((key) => {
      editor.ui.registry.addToggleButton(`ch-workitem__${key}`, {
        text: defaultList[key].name,
        tooltip: `${defaultList[key].name}`,
        onAction() {
          const targetDom = getCurrentChooseWorkItemTable();
          editor.execCommand("showWorkItemBlock", true, { key, targetDom });
        },
      });
    });
    editor.ui.registry.addToggleButton("ch-workitem__delete", {
      icon: workitemList.delete.iconName,
      tooltip: "workitem Block delete",
      onAction: function () {
        editor.execCommand("removeWorkItemBlock");
      },
    });


```

## 注册 bubble menu 按钮组

```js

    editor.ui.registry.addContextToolbar("chooseworkitem_toolbar", {
      predicate: function (node) {
        return isWorkItemBlock(node);
      },
      items: editor.getParam("chooseworkitem_toolbar", defaultBubbleMenu),
      position: "node",
      scope: "node",
    });
```

## 删除点击的元素

```js
    // 获取光标所在的业务对象表格
    const getCurrentChooseWorkItemTable = function () {
      const currentNode = editor.selection.getNode();
      let targetDom = null;
      if (
        editor.dom.is(currentNode, "div") &&
        editor.dom.hasClass(currentNode, "cherry-choose-workitem")
      ) {
        targetDom = currentNode;
      } else {
        const parentDom = editor.dom.getParent(
          currentNode,
          "div.cherry-choose-workitem"
        );
        if (parentDom) {
          targetDom = parentDom;
        }
      }
      if (
        !targetDom ||
        !editor.dom.hasClass(targetDom, "cherry-choose-workitem")
      ) {
        return false;
      }
      return targetDom;
    };
    // 删除业务对象表格
    const remove = function () {
      const targetDom = getCurrentChooseWorkItemTable();
      editor.dom.remove(targetDom);
    };


```
