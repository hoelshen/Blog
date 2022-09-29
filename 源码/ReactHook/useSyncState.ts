 export const useSyncState = <T>(
  initState?: T
): [{ current: T }, (data: T) => void] => {
  const [state, setStateValue] = useState<T>(initState as T)
  const stateRef = useRef<T>(state)
  const setState = (value: T) => {
    stateRef.current = value
    setStateValue(value)
  }

  return [stateRef, setState]
}
