/**
 * Move array item from (from) idx to (to) idx
 * Reference: https://github.com/granteagon/move/blob/master/src/index.js
 *
 * @param {*} arr array to operate
 * @param {*} from item idx to move
 * @param {*} to idx for the item to move to
 */
export const move = (arr, from, to) =>
  from - to > 0
    ? [
        ...arr.slice(0, to),
        arr[from],
        ...arr.slice(to, from),
        ...arr.slice(from + 1, arr.length),
      ]
    : from - to < 0
    ? [
        ...arr.slice(0, from),
        ...arr.slice(from + 1, to + 1),
        arr[from],
        ...arr.slice(to + 1, arr.length),
      ]
    : arr;
