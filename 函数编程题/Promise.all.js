Promise.all = function (arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    return new Promise((resolve, reject) => {
      arr[i]
        .then((res) => {
          resolve(res);
        })
        .cath((err) => {
          console.log(err);
        });
    });
  }
};
// --------------------
Promise.all = function (promiseArr) {
  let index = 0;
  result = [];
  return new Promise((resolve, reject) => {
    promiseArr.forEach((item, i) => {
      Promise.resolve(item).then(
        (val) => {
          index++;
          result[i] = val;
          if (index === promiseArr.length) {
            resolve(result);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  });
};
