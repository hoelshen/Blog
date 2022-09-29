function twoSum(arr,target){
  let Array = [];
  for(let i = 0;  i< arr.length; i++){
    for(let j = 1; j <= i; j++){
      console.log('xx', arr[j] , arr[i])
      if(target == arr[j] + arr[i]){
        Array.push(arr[j]);
        Array.push(arr[i]);
      };
    }
  }
  return Array
}
console.log(twoSum([3,2,4,3], 6));
