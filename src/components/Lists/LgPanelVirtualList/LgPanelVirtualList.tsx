import { SearchPlaylistBtn } from "components/Buttons";
import {
  CheckboxHooksReturn,
  HandleCheckOrUncheckId,
} from "components/Checkbox/hooks";
import memoizeOne from "memoize-one";
import React, { useCallback } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import AutoSizer from "react-virtualized-auto-sizer";
import { areEqual, FixedSizeList } from "react-window";
import { SnippetType } from "store/ytplaylist/types";

import { makeStyles } from "@material-ui/core";

import VirtualListSelectionHeader from "../VirtualListSelectionHeader";
import LgPanelVirtualListItem from "./LgPanelVirtualListItem";

interface LgPanelVirtualListProps {
  itemData: ItemData;
  snippetType: SnippetType;
  onDragEnd: (itemCount: number) => (result: DropResult) => void;
}

export interface ItemData {
  checked: string[];
  handleCheckOrUncheckId: HandleCheckOrUncheckId;

  // for select all / clear selected functionality
  // if client components do not plan to implement
  // those functionality, then both of the functions
  // can be ignored
  clearChecked?: CheckboxHooksReturn["clearChecked"];
  setChecked?: CheckboxHooksReturn["setChecked"];

  // main list item ids to render
  itemIds: string[];

  // property for determining type of ListItem's
  // SecondaryAction to be used.
  // ltp = list to play
  // pv  = playlist or video
  snippetType?: SnippetType;
}

interface LgPanelVirtualListRowProps {
  data: ItemData;
  index: number;
  style: React.CSSProperties | object;
}

/**
 * Get the key of list item to be used in react-window list
 *
 * @param index Array index
 * @param data Item data supplied to FixedSizeList
 * @returns Id as FixedSizeList item's key
 */
const _getItemKey = (index: number, data: ItemData): string | number =>
  data.itemIds[index];

/**
 * Memoized function to create itemData for react-window list
 *
 */
export const createItemData = memoizeOne((itemData: ItemData) => itemData);

const useStyles = makeStyles({
  noItemDiv: {
    fontSize: "1.4rem",

    "& button": {
      marginLeft: ".5rem",
    },
  },
});

/**
 * A helper function to get styles that aid for dnd functionality
 *
 * @param provided rbd provided props
 * @param style styles
 */
const getStyles = (
  provided: DraggableProvided,
  style?: React.CSSProperties | object
): React.CSSProperties | object => ({
  ...provided.draggableProps.style,
  ...(style ?? {}),
});

/**
 * Row for virtual list
 */
const LgPanelVirtualListRow = React.memo(
  (props: LgPanelVirtualListRowProps) => {
    const {
      data: { itemIds, ...restData },
      index,
      style,
    } = props;
    const itemId = itemIds[index];

    return (
      <Draggable draggableId={itemId} index={index} key={itemId}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <LgPanelVirtualListItem
            provided={provided}
            itemId={itemId}
            isDragging={snapshot.isDragging}
            style={getStyles(provided, style)}
            index={index}
            {...restData}
          />
        )}
      </Draggable>
    );
  },
  areEqual
);

LgPanelVirtualListRow.displayName = "LgPanelVirtualListRow";

/**
 * LgPanelVirtualList component
 *
 * Fixed size list that is used to hold large amount of list items without
 * all the data being loaded at once.
 *
 */
const LgPanelVirtualList = (props: LgPanelVirtualListProps) => {
  const {
    itemData,
    itemData: { itemIds, checked, clearChecked, setChecked },
    snippetType,
    onDragEnd,
  } = props;

  // LgPanelVirtualListItem will ignore the extra itemIds props
  // but LgPanelVirtualListRow will consume the itemIds
  const newItemData = { ...itemData, snippetType };

  const itemCount = itemIds.length;
  const classes = useStyles();

  // select (check) all filteredSnippets if they exist
  // else select all original items
  const handleSelectAll = useCallback(() => {
    if (setChecked) {
      setChecked(itemIds);
    }
  }, [itemIds, setChecked]);

  const handleClearSelected = useCallback(() => {
    if (clearChecked) {
      clearChecked();
    }
  }, [clearChecked]);

  // prevent property undefined error if no items/filteredSnippets
  return itemCount === 0 ? (
    <div className={classes.noItemDiv}>
      <span>No video found. Search for some playlist? </span>
      <SearchPlaylistBtn />
    </div>
  ) : (
    <AutoSizer>
      {({ height, width }) => (
        <DragDropContext onDragEnd={onDragEnd(itemCount)}>
          <Droppable
            droppableId="droppable"
            mode="virtual"
            renderClone={(
              provided: DraggableProvided,
              snapshot: DraggableStateSnapshot,
              rubric: DraggableRubric
            ) => (
              <LgPanelVirtualListItem
                provided={provided}
                itemId={itemIds[rubric.source.index]}
                style={getStyles(provided)}
                index={rubric.source.index}
                isDragging={snapshot.isDragging}
                {...newItemData}
              />
            )}
          >
            {(droppableProvided: DroppableProvided) => (
              <React.Fragment>
                <VirtualListSelectionHeader
                  width={width}
                  isChecked={checked.length !== 0}
                  isAllChecked={checked.length === itemCount}
                  checkedItemsCount={checked.length}
                  handleSelectAll={handleSelectAll}
                  handleClearSelected={handleClearSelected}
                />

                <FixedSizeList
                  height={height - 230}
                  itemCount={itemCount}
                  itemSize={80}
                  width={width}
                  itemKey={_getItemKey}
                  outerRef={droppableProvided.innerRef}
                  itemData={newItemData}
                >
                  {LgPanelVirtualListRow}
                </FixedSizeList>
              </React.Fragment>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </AutoSizer>
  );
};

export default LgPanelVirtualList;
