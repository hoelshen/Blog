   // var btn4 = document.getElementById('btn');
    // console.log('btn4: ', btn4);
    // btn4.addEventListener("click", hello1);
    // btn4.addEventListener("click", hello2);

    // function hello1() {
    //   alert("hello 1");
    // }

    // function hello2() {
    //   alert("hello 2");
    // }

    // function A() {

    //   alert("aaa");

    // }

    // function B() {

    //   alert("bbb");

    // }

    // var a = document.getElementById("a");
    // var b = document.getElementById("b");
    // var c = document.getElementById("c");
    // // 捕获
    // a.addEventListener("click", function(){
    //   alert("b-a")
    // },true)
    // b.addEventListener("click", function(){
    //   alert("b-b")
    // },true)
    // c.addEventListener("click", function(){
    //   alert("b-c")
    // },true)

    // // 冒泡
    // a.addEventListener("click", function(){
    //   alert("m-a")
    // },false)
    // b.addEventListener("click", function(){
    //   alert("m-b")
    // },false)
    // c.addEventListener("click", function(){
    //   alert("m-c")
    // },false)


    // var a = document.getElementById("a");
    // var b = document.getElementById("b");
    // var c = document.getElementById("c");
    // // 捕获
    // a.addEventListener("click", function(){
    //   alert("b-a")
    // },true)
    // b.addEventListener("click", function(){
    //   alert("b-b")
    // }) // 此处不在添加捕获事件，那么就是绑定一个默认的事件
    // c.addEventListener("click", function(){
    //   alert("b-c")
    // },true)

    // // 冒泡
    // a.addEventListener("click", function(){
    //   alert("m-a")
    // },false)
    // b.addEventListener("click", function(){
    //   alert("m-b")
    // },false)
    // c.addEventListener("click", function(){
    //   alert("m-c")
    // },false)


    var a = document.getElementById("a");
    var b = document.getElementById("b");
    var c = document.getElementById("c");
    // 捕获
    a.addEventListener("click", function(){
      alert("b-a")
    },true)


    b.addEventListener("click", function(){
      alert("m-b")
    },false) // 把b的冒泡放在这里来了
    b.addEventListener("click", function(){
      alert("b-b")
    }) // 此处不在添加捕获事件，那么就是绑定一个默认的事件。即冒泡


    c.addEventListener("click", function(){
      alert("b-c")
    },true)

    // 冒泡
    a.addEventListener("click", function(){
      alert("m-a")
    },false)
    c.addEventListener("click", function(){
      alert("m-c")
    },false)


    preventDefault



    //事件委托
    var oBox = document.getElementById("box");

    addEvent(oBox,'click',function(e){
      var target = e.target;
      // 判断点击的是li
      if ( target.nodeName == 'LI' ) {
        alert(target.innerHTML)
    }

    function addEvent(ele,type,selector,fn){
      // 如果只有三个参数，那么3,4互换
      if ( fn == null ) {
        fn = selector;
        selector = null
      }
      ele.addEventListener(type,function(e){
        var target;
        if ( selector ) {
          //  代理
          target = e.target;
          if(target.matches(selector)){
            fn.call(target.e)
          }
        } else {
          // 不代理
          fn(e)
        }
      })
    }