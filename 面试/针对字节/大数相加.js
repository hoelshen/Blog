// 大数相加

function addBigNum(a, b) {
  //取两个数字的最大长度
  let maxLength = Math.max(a.length, b.length);

  //用0去补齐长度
  a = a.padStart(maxLength, 0); //"0009007199254740991"
  b = b.padStart(maxLength, 0); //"1234567899999999999"
  //定义加法过程中需要用到的变量
  let t = 0;
  let f = 0; //"进位"
  let sum = "";
  for(let i = maxLength - 1; i >= 0; i--) {
    t = parseInt(a[i]) + parseInt(b[i]) + f;
    sum = t % 10 + sum;
    f = Math.floor(t / 10);
  }
  if(f == 1) {
    sum = '1' + sum;
  }
  return sum;
}