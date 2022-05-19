
## position 定位方式

position几种定位方式
static：为默认。 不能进行z-index 划分层次。
relative:相对定位，不脱离文档流，根据自身位置定位，可用z-index 分层。
absolute：绝对定位，可脱离文档流，选取其最近的父级元素定位
fixed：为固定定位，参照对象为浏览器窗口，能用z-index 划分层次。

relative： 而相对定位就是将元素偏离元素的默认位置，但普通流中依然保持着原有的默认位置，并没有脱离普通流，只是视觉上发生的偏移。

如果在其节点树中所有父（祖）元素都没有设置position属性值为relative或者absolute则该元素最终将对body进行位置偏移。应用了position: absolute的元素会脱离页面中的普通流并改变Display属性（重点）！
