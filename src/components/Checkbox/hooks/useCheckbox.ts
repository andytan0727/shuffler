import { useCallback, useState } from "react";
import { addOrRemove } from "utils/helper/arrayHelper";

/**
 * useCheckbox hooks
 *
 * React hook that manages an array to store a set of checked ids. The id can be
 * from playlists/videos, depends on what client wants
 *
 */
export const useCheckbox = () => {
  const [checked, setChecked] = useState([] as string[]);

  /**
   * Main function to handle add/remove id to/from checked array.
   *
   * It is a higher-order function that accepts id and making it as the closure
   * for the inner function returned
   *
   * @param {string} id Id to be added/removed
   * @returns Curried event handler
   *
   */
  const handleSetChecked = useCallback(
    (id: string) => (e: OnClickEvent | InputChangeEvent) => {
      // stop event bubbling to parent div and checks checkbox twice
      e.stopPropagation();

      setChecked(addOrRemove(checked, id));
    },
    [checked, setChecked]
  );

  /**
   * Clear all contents of checked
   *
   */
  const clearChecked = useCallback(() => setChecked([]), [setChecked]);

  return {
    checked,
    handleSetChecked,
    clearChecked,
  };
};

type CheckboxHooksReturn = ReturnType<typeof useCheckbox>;
export type HandleSetChecked = CheckboxHooksReturn["handleSetChecked"];
export type ClearChecked = CheckboxHooksReturn["clearChecked"];
