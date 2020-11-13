function Fiber(n){
  if(n ==1) return 1;
  if(n ==0) return 0;
  return  Fiber(n-1) + Fiber(n-2);
}

console.log(Fiber(3))

let fibonacci = (function() {
  let memory = []
  return function(n) {
      if(memory[n] !== undefined) {
        return memory[n]
    }
    return memory[n] = (n === 0 || n === 1) ? n : fibonacci(n-1) + fibonacci(n-2)
  }
})()