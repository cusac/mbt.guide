/* eslint-disable @typescript-eslint/no-this-alias */

/**
 * This allows debounce to be called with a stateful timeout value so that the debounce invokation persists between component renders.
 * @param wait time in ms to wait between function calls
 * @param statefulTimeout the timeout value tracked in the component
 * @param setStatefulTimeout the react hook to set the timeout value
 */
export default function statefulDebounce(
  func: (...args: any) => any,
  wait: number,
  statefulTimeout: number,
  setStatefulTimeout: (arg0: number) => void
) {
  return function(...args: any) {
    // @ts-ignore
    const context = this;
    clearTimeout(statefulTimeout);
    const localTimeout: any = setTimeout(() => func.apply(context, args), wait);
    setStatefulTimeout(localTimeout);
  };
}
