import { useSelector } from "react-redux";
import { reorderListToPlayItemAction } from "store/ytplaylist/listToPlayActions";
import { selectListToPlayTotalItems } from "store/ytplaylist/listToPlaySelectors";

import { useOnDragEnd } from "../shared/useOnDragEnd";

export const useDragListToPlayItem = () => {
  const listToPlayItemCount = useSelector(selectListToPlayTotalItems);
  const { handleOnDragEnd } = useOnDragEnd(
    listToPlayItemCount,
    reorderListToPlayItemAction
  );

  return {
    handleOnDragEnd,
  };
};
