function test(){
  // 归并排序算法, A是数组，n表示数组大小
  function merge_sort(A) {
    merge_sort_c(A, 0, A.length-1)
    return A
  }

  // 递归调用函数
  function merge_sort_c(A, p, r) {
    // 递归终止条件
    if (p >= r ) return

    // 取p到r之间的中间位置mid
    mid = Math.floor((p+r) / 2)
    // 分治递归
    merge_sort_c(A, p, mid)
    merge_sort_c(A, mid+1, r)
    // 将A[p...q]和A[q+1...r]合并为A[p...r]
    merge(A[p,r], A[p,mid], A[mid+1,r])
  }


  function merge(A[p,r], A[p,q], A[q+1,r]) {
    var i = p,j = q+1,k = 0 // 初始化变量i, j, k
    var tmp = new array[0,r-p] // 申请一个大小跟A[p...r]一样的临时数组
    while( i<=q  &&  j<=r  ){
      if (A[i] <= A[j]) {
        tmp[k++] = A[i++] // i++等于i=i+1
      } else {
        tmp[k++] = A[j++]
      }
    }
    
    // 判断哪个子数组中有剩余的数据
    var start = i,end = q
    if (j<=r) { start = j, end=r}
    
    // 将剩余的数据拷贝到临时数组tmp
    while(start <= end){
      tmp[k++] = A[start++]
    }
    
    // 将tmp中的数组拷贝回A[p...r]
    for(i=0 in r-p) {
      A[p+i] = tmp[i]
    }
  }
  merge_sort([32,12,56,78,76,45,36])
}
test();

function merge_sort(arr){
  if(arr.length < 2){
    return arr;
  }
  var middle = parseInt(arr.length/2);
  var left = arr.slice(0,middle);
  var right = arr.slice(middle);
  
  return merge(merge_sort(left),merge_sort(right));
}

function merge(left,right){
  var result = [];
  var i = 0, j = 0;
  while(i < left.length && j < right.length){
    if(left[i] > right[j]){
      result.push(right[j++]);
    }
    else{
      result.push(left[i++]);
    }
  }
  while(i < left.length){
    result.push(left[i++]);
  }
  while(j < right.length){
    result.push(right[j++]);
  }
  
  return result;
}

var arr = [1, 2, 3, 5, 6, 7, 8, 9];
var result = merge_sort(arr);
console.log(result);  //[1, 2, 3, 5, 6, 7, 8, 9]


function sort(elements){
  for(var i = 1; i< elements.length; i++){
    if(elements[i] < elements[i-1]){
      // 取出无序数列中第i个作为被插入元素
      var gurd = elements[i];
      //记住有序数列的最后一个位置，并且将有序数列位置扩大一个
      var j = i -1;
      elements[i] = elements[j];
      // 比大小， 找到被插入元素所在的位置
      while(j >= 0 && gurd < elements[j]){
        elements[j + 1] = elements[j];
        j--;
      }
      elements[j+1] = gurd;
    }
  }
}