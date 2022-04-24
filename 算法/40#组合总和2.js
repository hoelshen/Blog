/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
// var combinationSum2 = function(candidates, target) {
//   //回朔法
//   var res = [];
//   var n = candidates.length;
//   let tmpPath = [];
//   const start = 0;
//   candidates = candidates.sort((a,b) => {return a - b})
//   function backTrack(tmpPath, target, start){
//     if(target == 0){
//       res.push(tmpPath)
//       return 
//     }
//     for(let i = start; i < n ; i++){
//       if (candidates[i] === candidates[i-1] && i > start) continue;
//       tmpPath.push(candidates[i])
//       backTrack(tmpPath.slice(), target - candidates[i], i)
//       tmpPath.pop()
//     }
//   }

//   backTrack(tmpPath, target, start)
//   return res
// };


/**
 * [
  [1, 7],
  [1, 2, 5],
  [2, 6],
  [1, 1, 6]
]
 */

var combinationSum2 = function(candidates, target) {
  candidates.sort((a,b)=>{return b-a})

 let len =  candidates.length
 let min = candidates[len-1];
 let res=[];
 let path =[];

function combin(candidates,target,i,path) {
    if(target == 0){
        return res.push(path.slice())
    }
    
    if(target < min){
        return;
    }
    
    for(let start =i;start < len ;start++){
        // if (candidates[start] === candidates[start-1] && start > i) continue;
        path.push(candidates[start])
        combin(candidates,target-candidates[start],start+1,path)
        path.pop()
    }
}
  
  combin(candidates,target,0,path);
  
  return res;
};


var candidates = [10,1,2,7,6,1,5], target = 8;
// var candidates = [2,3,7], target = 7;

var val = combinationSum2(candidates, target);
console.log('val: ', val);

// 比上一题多加一个判断
// if (candidates[start] === candidates[start-1] && start > i) continue;
// 如果两个一样的数字，只要走前一个就好
