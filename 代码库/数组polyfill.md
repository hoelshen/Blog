```js
(function (arr) {
    arr.forEach((item) => {
        if (item.hasOwnProperty('remove')) {
            return;
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                this.parentNode.removeChild(this);
            }
        });
    });
}([Element.prototype, CharacterData.prototype, DocumentType.prototype]));

```


```js
function saveSvgAsPng(el, name, options) {
    requireDomNode(el);

    options = options || {};
    svgAsPngUri(el, options, (uri) => {
        // 前端触发下载有问题，改成后端触发下载
        // download(name, uri);

        postToServer(name, uri, 'png');
    });
}




```