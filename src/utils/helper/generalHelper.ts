/**
 * Detect whether the list is currently being filtered
 *
 * @param oriItemCount Original count of items in list
 * @param curItemCount Current count of items in list
 * @returns Boolean indicating the condition
 */
export const isFiltering = (oriItemCount: number, curItemCount: number) =>
  oriItemCount !== curItemCount;
