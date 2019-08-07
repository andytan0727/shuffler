import { useCallback, useState } from "react";
import { addOrRemove } from "utils/helper/arrayHelper";

export const useCheckbox = () => {
  const [checked, setCheckedAction] = useState([] as string[]);

  const handleSetChecked = useCallback(
    (id: string) => (e: OnClickEvent) => {
      // stop event bubbling to parent div and checks checkbox twice
      e.stopPropagation();

      setCheckedAction(addOrRemove(checked, id));
    },
    [checked, setCheckedAction]
  );

  return {
    checked,
    handleSetChecked,
  };
};
