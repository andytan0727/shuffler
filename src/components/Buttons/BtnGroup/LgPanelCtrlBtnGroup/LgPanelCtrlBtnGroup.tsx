import React from "react";
import { useSelector } from "react-redux";
import { selectFilteredSnippets } from "store/ytplaylist/filteredSelectors";

import { IconButton, Tooltip } from "@material-ui/core";
import {
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Shuffle as ShuffleIcon,
} from "@material-ui/icons";

export interface LgPanelCtrlBtnGroupProps {
  handlePlay: (e: OnClickEvent) => void;
  handleShuffle: (e: OnClickEvent) => void;
  handleDelete: (e: OnClickEvent) => void;
}

const LgPanelCtrlBtnGroup = (props: LgPanelCtrlBtnGroupProps) => {
  const { handlePlay, handleShuffle, handleDelete } = props;

  // disable shuffle button if user is filtering snippets
  // i.e when the filteredSnippets array is not undefined
  const filteredSnippets = useSelector(selectFilteredSnippets);

  return (
    <div>
      <Tooltip title="Play">
        <IconButton color="secondary" onClick={handlePlay}>
          <PlayArrowIcon />
        </IconButton>
      </Tooltip>
      {filteredSnippets ? (
        <IconButton
          color="secondary"
          onClick={handleShuffle}
          disabled={!!filteredSnippets}
        >
          <ShuffleIcon />
        </IconButton>
      ) : (
        <Tooltip title="Shuffle">
          <IconButton color="secondary" onClick={handleShuffle}>
            <ShuffleIcon />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Delete Selected">
        <IconButton color="secondary" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default LgPanelCtrlBtnGroup;
