// @flow

export default function isArraySorted<T>(arr: Array<T>, compare: (T, T) => number) {
  return arr.slice(1).every((x, i) => compare(arr[i], arr[i + 1]) < 1);
}
