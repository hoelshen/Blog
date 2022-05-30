
如果x是质数，那么大于x的x的倍数2x，3x，。。。一定不是质数

按我理解 质数的意思是除了1和他本身 不能够被除

2，3，5， 7， 11
3是质数 6，10，12
12 
4 

如果一个数，则将其所有的倍数都标记为合数（除了该质数本身），即0，这样在运行结束的时候我们即能知道质数的个数


function countPrimes(n) {
  let count = 0;
  let isPrime = new Array(n).fill(1);
  for (let i = 2; i < n; i++) {
    if (isPrime[i]) {
      count += 1;
      for (let j = i * i; j < n; j += i) {
        isPrime[j] = 0;
      }
    }
  }
  return count;
}
