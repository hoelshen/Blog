const debounce = function(func, interval){
  let timerId;

  return function(e){
    clearTimeout(timerId);
    timerId = setTimeout(function(){
      func.apply()
    }, interval)
  }

}

debounce(apiCall, 3000)


let throttle =  function(fn, delay){
  let currentTime = new Date();

  setTimeout(()=>{
    let startTime = Date.now();
    if(currentTime - starTime > delay){
      fn()
    } else {
      startTime = 
    }
  }, delay)
}