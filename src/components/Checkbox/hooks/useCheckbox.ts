import { useCallback, useState } from "react";
import { addOrRemove } from "utils/helper/arrayHelper";

/**
 * useCheckbox hooks
 *
 * React hook that manages an array to store
 * a set of checked ids. The id can be
 * playlists/videos id
 *
 */
export const useCheckbox = () => {
  const [checked, setChecked] = useState([] as string[]);

  /**
   * Main function to handle add/remove id to/from checked array.
   *
   * It is a higher-order function that accepts
   * an playlist/video id and making it as the
   * closure for the inner function returned
   *
   * @param id Id to be added/removed
   * @returns Curried event handler
   *
   */
  const handleCheckOrUncheckId = useCallback(
    (id: string) => (e?: OnClickEvent | InputChangeEvent) => {
      // stop event bubbling to parent div and checks checkbox twice
      if (e) {
        e.stopPropagation();
      }

      setChecked(addOrRemove(checked, id));
    },
    [checked, setChecked]
  );

  /**
   * Clear all contents of checked array
   *
   */
  const clearChecked = useCallback(() => setChecked([]), [setChecked]);

  return {
    checked,
    handleCheckOrUncheckId,
    clearChecked,

    // low level function
    // for fine grained operations that
    // needs direct write access to checked
    setChecked,
  };
};

type CheckboxHooksReturn = ReturnType<typeof useCheckbox>;
export type HandleCheckOrUncheckId = CheckboxHooksReturn["handleCheckOrUncheckId"];
export type ClearChecked = CheckboxHooksReturn["clearChecked"];
export type SetChecked = CheckboxHooksReturn["setChecked"];
