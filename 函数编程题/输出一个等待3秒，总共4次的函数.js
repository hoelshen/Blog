
function lazy(fun, times, count) {
  var total = 0;
  var id = setInterval(function() {
      total++;
      if (total == count) {
          clearInterval(id);
      }
      fun && fun();
  }, times);
}
// function lazy() {
//   var total = 0;
//   var id = setInterval(function() {
//       total++;
//       if (total == 4) {
//           clearInterval(id);
//       }
//       console.log(1);
//   }, 3000);
// }
// lazy();
lazy(function (){console.log('输出一个等待3秒，总共4次的函数.js')}, 3000 , 4);
