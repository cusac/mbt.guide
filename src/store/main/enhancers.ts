const round = (number: any) => Math.round(number * 100) / 100;

export const monitorReducerEnhancer = (createStore: any) => (
  reducer: any,
  initialState: any,
  enhancer: any
): any => {
  const monitoredReducer = (state: any, action: any) => {
    const start = performance.now();
    const newState = reducer(state, action);
    const end = performance.now();
    const diff = round(end - start);

    console.log('reducer process time:', diff);

    return newState;
  };

  return createStore(monitoredReducer, initialState, enhancer);
};
