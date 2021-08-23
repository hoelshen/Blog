

```js
const eventBus = {};
  on(name, fn) {
      if (!eventBus[name]) {
          eventBus[name] = [];
      }
      eventBus[name].push(fn);
  }

  emit(name, data) {
      if (eventBus[name]) {
          eventBus[name].forEach((fn) => {
              fn(data);
          });
      }
  }

  off(name, fn) {
      if (eventBus[name]) {
          if (fn) {
              const index = eventBus[name].indexOf(fn);
              if (index !== -1) {
                  eventBus[name].splice(index, 1);
              }
          } else {
              eventBus[name] = [];
          }
      }
  }

```