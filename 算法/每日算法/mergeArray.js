const arr = [
  {
    start_time: '2020-12-26',
    end_time: '2020-12-28',
    type: '1',
  },
  {
    start_time: '2020-12-29',
    end_time: '2021-01-12',
    type: '0',
  },
  {
    start_time: '2021-01-12',
    end_time: '2021-01-29',
    type: '0',
  },
  {
    start_time: '2021-01-29',
    end_time: '2021-04-16',
    type: '0',
  },
  {
    start_time: '2021-04-16',
    end_time: '2021-04-18',
    type: '1',
  },
]

function mergeArray(arr) {
  let res = [];
  let prev = arr[0];
  for (let i = 1; i < arr.length; i++) {
    let cur = arr[i];
    // 有重合
    if (prev.end_time == cur.start_time && prev.type == cur.type) {
      prev.end_time = cur.end_time;
    } else {
        res.push(prev);
        prev = cur;  // 更新 prev
    }
  }
  // 最后一次赋值，也要 push 一下
  res.push(prev);
  return res;
}
console.log(mergeArray(arr))
