export default function isArraySorted<T>(arr: Array<T>, compare: (arg0: T, arg1: T) => number) {
  return arr.slice(1).every((x, i) => compare(arr[i], arr[i + 1]) < 1);
}
