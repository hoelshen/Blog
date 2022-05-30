function floatArr(arr) {
  const arr1 = [];
  const genArr = function (arr) {
    for (let i = 0; i < arr.length; i++) {
      if (Object.prototype.toString.call(arr[i]) === "[object Array]") {
        genArr(arr[i]);
      } else {
        arr1.push(arr[i]);
      }
    }
    return arr1;
  };
  return genArr(arr);
}

function floatArr(arr) {
  let arr1 = [];
  for (let i = 0; i < arr.length; i++) {
    if (Object.prototype.toString.call(arr[i]) === "[object Array]") {
      arr1 = arr1.concat(floatArr(arr[i]));
    } else {
      arr1.push(arr[i]);
    }
  }
  return arr1;
}
const arr = [1, [2, 3], [4, [5, 6], [7, [8, [9]]]]];
console.log(floatArr(arr));
