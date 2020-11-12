<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>css居中</title>
  <style>

   /* 1.flex*/
/*     .parent{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 500px;
      height: 500px;
      background-color: aqua;
    }
    .child{
      width: 100px;
      height: 100px;
      background-color: blue;
    } */

    /* position + margin  */ 

    /*
    
   2. 利用绝对定位 + margin:auto
    // 优点： 不需要提前知道尺寸， 兼容性好
    
     */ 
/*     .parent{
      position: relative;
      background-color: aqua;
      width: 500px;
      height: 500px;
    }

    .child{
      position: absolute;
      width: 100px;
      height: 100px;
      background-color: blue;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    } */


    /*
    3. 
    优点是兼容性不错
    缺点：需要提前知道子尺寸，margin-top: -(高度的一半); margin-left: -(宽度的一半);
    
    */


/*     .parent {
      position: relative;
      background-color: aqua;
      height: 500px;
    }

    .child{
      position: relative;
      width: 100px;
      height: 100px;
      left: 50%;
      top: 50%;
      background-color: blue;
      margin-top: -50px;
      margin-left: -50px;
    }
 */

    /* 
    4.
    利用transform 配合 position*/

/*     .parent{
      position: relative;
      background-color: aqua;
      height: 500px;
      width: 500px;
    }


    .child{
      position: relative;
      width: 100px;
      height: 100px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: blue;
    } */


    /*5.table  */
    .parent{
      background-color: aqua;
      width: 500px;
      height: 500px;
      display: table;
      border: 1px solid red;
    }

    .child{
      width: 20px;
      height: 20px;
      display: table-cell;
      vertical-align: middle;
      background-color: blue;
    }


  </style>
</head>
<body>
  <div class="parent">
    <div class="child">
      居中
    </div>
  </div>
</body>
</html>