# 两栏布局

```js
* css{

  .left {
    width: 100px;
    height: 100px;
    float: left;
    background-color: rgb(68, 156, 28);
  }
  .right {
    width: 100%;
    height: 100px;
    background-color: rgb(25, 39, 161);
    overflow: hidden
  }
}

* css{

  .app{
    display: flex;
    .left {
      width: 100px;
      height: 100px;
      background-color: rgb(68, 156, 28);
    }
    .right {
      width: 100%;
      height: 100px;
      background-color: rgb(25, 39, 161);
    }

  }
}

* css {
    width : 100%;
    float: left
    .right:{
      margin-left: 200px
    }
    .left{
      float: left;
      margin-left: -100%;
    }
}
