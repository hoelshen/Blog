# svg

格式解析

## 实现svg 的三种方式  

### unicode

### font-class  

第一步：拷贝项目下面生成的fontclass代码：
//at.alicdn.com/t/font_8d5l8fzk5b87iudi.css
第二步：挑选相应图标并获取类名，应用于页面：
<i class="iconfont icon-xxx"></i>


### symbol

第一步：拷贝项目下面生成的symbol代码：
//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js
第二步：加入通用css代码（引入一次就行）：
<style type="text/css">
    .icon {
       width: 1em; height: 1em;
       vertical-align: -0.15em;
       fill: currentColor;
       overflow: hidden;
    }
</style>
第三步：挑选相应图标并获取类名，应用于页面：
<svg class="icon" aria-hidden="true">
    <use xlink:href="#icon-xxx"></use>
</svg>


## 







##  react  


 <svg width="10" height="10">  <rect x="0" y="0" width="10" height="10" fill="blue" /></svg>

xlinkHref




##






##