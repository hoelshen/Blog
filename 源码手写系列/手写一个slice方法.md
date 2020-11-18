
# 手写一个 slice 方法

```js
Array.prototype.slice = function(start, end){
  var result = new Array();
  start = start || 0;
  end = end || this.length;
  for(var i  = start; i < end; i++){
    result.push(this[i]);
  }
  return result
}


```

```js
var args = Array.from(arguments);
var args = [...arguments];
```

一、slice(start，end)

从start开始截取到end但是不包括end
返回值为截取出来的元素的集合
原始的数组不会发生变化

```js
//例子
        var arr1 = [1,23,44,55,66,77,888,"fff"];
        var arr2 = arr1.slice(2,4) //从index为2截取到index为4之前不包括4
        console.log(arr2); //[44,55]
        console.log(arr1); // [1,23,44,55,66,77,888,"fff"]原始数组没有被改变

```

splice(start,deleteCount,item1,item2…..);

start参数 开始的位置
deleteCount 要截取的个数
后面的items为要添加的元素
如果deleteCount为0，则表示不删除元素，从start位置开始添加后面的几个元素到原始的数组里面
返回值为由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组
这个方法会改变原始数组，数组的长度会发生变化

```js
//例子
        var arr3 = [1,2,3,4,5,6,7,"f1","f2"];
        var arr4 = arr3.splice(2,3) //删除第三个元素以后的三个数组元素(包含第三个元素)
        console.log(arr4); //[3,4,5];
        console.log(arr3); //[1,2,6,7,"f1","f2"]; 原始数组被改变

        var arr5 = arr3.splice(2,0,"wu","leon"); 
        //从第2位开始删除0个元素，插入"wu","leon"
        console.log(arr5); //[] 返回空数组
        console.log(arr3); // [1, 2, "wu", "leon", 6, 7, "f1", "f2"]; 原始数组被改变

        var arr6 = arr3.splice(2,3,"xiao","long");
        //从第2位开始删除3个元素，插入"xiao","long"
        console.log(arr6); //["wu", "leon", 6]
        console.log(arr3); //[1, 2, "xiao", "long", 7, "f1", "f2"]

        var arr7 = arr3.splice(2);//从第三个元素开始删除所有的元素
        console.log(arr7);//["xiao", "long", 7, "f1", "f2"]
        console.log(arr3); //[1, 2]
```
