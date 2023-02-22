function QueryableWorker(url, defaultListener, onError) {
  var instance = this,
    worker = new Worker(url),
    listeners = {};

  this.defaultListener = defaultListener || function () {};

  if (onError) {
    worker.onerror = onError;
  }

  this.postMessage = function (message) {
    worker.postMessage(message);
  };

  this.terminate = function () {
    worker.terminate();
  };
  this.addListeners = function (name, listener) {
    listeners[name] = listener;
  };

  this.removeListeners = function (name) {
    delete listeners[name];
  };
  /*
  This functions takes at least one argument, the method name we want to query.
  Then we can pass in the arguments that the method needs.
 */
  this.sendQuery = function () {
    if (arguments.length < 1) {
      throw new TypeError(
        "QueryableWorker.sendQuery takes at least one argument"
      );
    }
    worker.postMessage({
      queryMethod: arguments[0],
      queryArguments: Array.prototype.slice.call(arguments, 1),
    });
  };
}

var queryableFunctions = {
  getDifference: function (a, b) {
    reply("printStuff", a - b);
  },
  waitSomeTime: function () {
    setTimeout(function () {
      reply("doAlert", 3, "seconds");
    }, 3000);
  },
};

function reply() {
  if (arguments.length < 1) {
    throw new TypeError("reply - takes at least one argument");
  }
  postMessage({
    queryMethodListener: arguments[0],
    queryMethodArguments: Array.prototype.slice.call(arguments, 1),
  });
}

/* This method is called when main page calls QueryWorker's postMessage method directly*/
function defaultReply(message) {
  // do something
}
