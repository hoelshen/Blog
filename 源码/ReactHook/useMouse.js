const initState = {
  screenX: NaN,
  screenY: NaN,
  clientX: NaN,
  clientY: NaN,
  pageX: NaN,
  pageY: NaN,
};

export const useMouse = () => {
  const [state, setState] = useState(initState);
  const moveFun = useCallback((state) => {
    setState(state);
  }, []);
  const debounceFn = useCallback(
    _.throttle(moveFun, 250, {
      leading: false,
      trailing: true,
    }),
    [changeFun]
  );

  useEffect(() => {
    const handler = (event) => {
      const { screenX, screenY, clientX, clientY, pageX, pageY } = event;
      const newState = {
        screenX,
        screenY,
        clientX,
        clientY,
        pageX,
        pageY,
      };
      debounceFn(newState);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return state;
};
