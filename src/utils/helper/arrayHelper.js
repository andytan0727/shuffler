/**
 * Move array item from (from) idx to (to) idx
 * Reference: https://github.com/granteagon/move/blob/master/src/index.js
 *
 * @param {Array<*>} arr array to operate
 * @param {number} from item idx to move
 * @param {number} to idx for the item to move to
 * @returns {Array<*>} Moved array
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

/**
 * Generate new array from an original array without modifying its contents
 *
 * @param {Array<string>} arr An array of old values
 * @param {string} value Value to remove (if exists)
 *                       or add (if absent) from/to new array
 * @returns {Array<string>} Newly generated array
 */
export const addOrRemove = (arr, value) =>
  !arr.includes(value) ? [...arr, value] : arr.filter((val) => val !== value);
