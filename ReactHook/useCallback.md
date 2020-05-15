

```jsx
  const onClick = useCallback(()=>{
    console.log('Click')
    setClickCount(clickCount + 1);
    console.log(counterRef.current)
  }, [counterRef])
```



































