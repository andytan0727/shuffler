import React from "react";
import { useSelector } from "react-redux";
import { selectFilteredSnippets } from "store/ytplaylist/filteredSelectors";

import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Shuffle as ShuffleIcon,
} from "@material-ui/icons";

export interface LgPanelCtrlBtnGroupProps {
  handlePlay: (e: OnClickEvent) => void;
  handleShuffle: (e: OnClickEvent) => void;
  handleDelete: (e: OnClickEvent) => void;
}

interface LgPanelCtrlBtnGroupWithRenameProps extends LgPanelCtrlBtnGroupProps {
  handleRename: (e: OnClickEvent) => void;
}

const useStyles = makeStyles({
  panelWithRenameDiv: {
    display: "flex",
  },
});

export const LgPanelCtrlBtnGroupWithRename = (
  props: LgPanelCtrlBtnGroupWithRenameProps
) => {
  const { handleRename, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={classes.panelWithRenameDiv}>
      <LgPanelCtrlBtnGroup {...rest} />
      <Tooltip title="Rename">
        <IconButton color="secondary" onClick={handleRename}>
          <EditIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

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
