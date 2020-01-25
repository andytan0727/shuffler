import { useSelector } from "react-redux";
import { reorderVideoItem } from "store/ytplaylist/videoActions";
import { selectVideoItemCount } from "store/ytplaylist/videoSelectors";

import { useOnDragEnd } from "../shared/useOnDragEnd";

export const useDragVideoItem = () => {
  const videoItemCount = useSelector(selectVideoItemCount);
  const { handleOnDragEnd } = useOnDragEnd(videoItemCount, reorderVideoItem);

  return {
    handleOnDragEnd,
  };
};
