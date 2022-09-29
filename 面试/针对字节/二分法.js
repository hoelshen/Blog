
function BinarySearch(arr, target){
  let mid = Math.ceil(arr.length / 2);
  let i, j = 0;
  for (i = 0; i <= mid; i++){
    if (arr[i] === target) {
      return i
    }
  }
  for ( j = arr.length; j > mid; j--){
    if (arr[j] === target) {
      return j
    }
  }
  return -1
}

const arr = [1, 4, 5, 6, 7, 8, 10, 11, 23, 42, 44, 54, 56, 77, 102];

// console.log(BinarySearch(arr, 44))
console.log(BinarySearch([3,4,6,7,10], 5))

