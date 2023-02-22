// TODO: 写一个worker.js文件，这个文件里面有一个worker对象，这个对象有一个message事件，当这个worker对象接收到主线程传递过来的数据时，就会触发这个message事件，然后在这个事件里面，我们就可以对这个数据进行处理，然后再把处理后的数据传递给主线程


addEventListener(
  "message",
  function (evt) {
    console.log("🚀 ~ file: worker.js:7 ~ evt:", evt)
    var date = new Date();
    var currentDate = null;
    do {
      currentDate = new Date();
    } while (currentDate - date < evt.data);
    postMessage(currentDate);
  },
  false
);