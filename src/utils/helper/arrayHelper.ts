/**
 * Move array item from (from) idx to (to) idx (mutable ops)
 *
 * @param arr array to operate
 * @param from item idx to move
 * @param to idx for the item to move to
 */
export const moveMutable = <T>(arr: T[], fromIdx: number, toIdx: number) => {
  const [removed] = arr.splice(fromIdx, 1);
  arr.splice(toIdx, 0, removed);
};

/**
 * Move array item from (from) idx to (to) idx (immutable ops)
 *
 * @param arr array to operate
 * @param from item idx to move
 * @param to idx for the item to move to
 * @returns Moved array
 */
export const move = <T>(arr: T[], fromIdx: number, toIdx: number): T[] => {
  const result = Array.from(arr);
  // const [removed] = result.splice(fromIdx, 1);
  // result.splice(toIdx, 0, removed);
  moveMutable(result, fromIdx, toIdx);

  return result;
};

/**
 * Generate new array from an original array without modifying its contents
 *
 * @param arr An array of old values
 * @param value Value to remove (if exists)
 *                       or add (if absent) from/to new array
 * @returns Newly generated array
 */
export const addOrRemove = <T extends string | number>(arr: T[], value: T) =>
  !arr.includes(value) ? [...arr, value] : arr.filter((val) => val !== value);
