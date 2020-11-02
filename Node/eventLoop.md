## 

1. timer  
执行setTimout（）和 setInterval设定的回调
2. I/O callbacks  
3. idel, prepare  仅内部使用
4. poll  获取新的i/o 事件， 在适当条件下， node。js会在这里堵塞
5. check  setimmediate（）设定的回调会在这一阶段执行
6. close callbacks  socket.on（"close"， callback）的回调在这一阶段执行


##