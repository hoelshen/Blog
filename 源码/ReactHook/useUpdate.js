import { useState } from "react";

const useUpdate = () => {
  const [, setFlag] = useState();
  const update = () => {
    setFlag(Date.now());
  };

  return update;
};

export default useUpdate;


// 我们都知道如果想让组件重新渲染，我们不得不更新state，但是有时候业务有需要的state是没有必要更新的，我们不能为了让组件会重新渲染而强制让一个state做无意义的更新，所以这个时候我们就可以自定义更新hooks来优雅的实现组件的强制更新