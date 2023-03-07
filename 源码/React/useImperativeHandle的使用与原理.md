```jsx
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const App = forwardRef((props, ref) => {
  const [phone, setPhone] = useState("");
  useImperativeHandle(
    ref,
    () => ({
      type: "text",
      name: "phone",
      value: phone,
    }),
    [phone]
  );
  useEffect(() => {
    setTimeout(() => {
      setPhone("9898098909");
    }, 3000);
  }, []);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
});

const Parent = () => {
  const appRef = useRef(null);
  const handleClick = () => {
    console.log(appRef.current.value);
  };
  return (
    <>
      <App ref={appRef} />
      <button onClick={handleClick}>Click</button>
    </>
  );
};
const rootElement = document.getElementById("root");
ReactDOM.render(<Parent />, rootElement);
```
