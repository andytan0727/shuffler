import React from "react";

import { Badge, Button, Checkbox, FormControlLabel } from "@material-ui/core";
import { CheckBoxOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

interface VirtualListSelectionHeaderProps {
  width: string | number;
  isChecked: boolean;
  isAllChecked: boolean;
  checkedItemsCount: number;
  handleSelectAll: (e: InputChangeEvent) => void;
  handleClearSelected: (e: InputChangeEvent | OnClickEvent) => void;
}

const useStyles = makeStyles({
  virtualListSelectionHeaderDiv: (width: string | number) => ({
    width,
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255, .23)",
  }),
  checkboxFormContainer: {
    display: "flex",
    alignItems: "center",
    flexGrow: 2,
  },
  checkbox: {
    // align with list items' checkbox
    marginLeft: -12,
    userSelect: "none",
  },
  badge: {
    "& .MuiBadge-badge": {
      color: "black",
      fontWeight: "bold",
    },
  },
});

const VirtualListSelectionHeader = (props: VirtualListSelectionHeaderProps) => {
  const {
    width,
    isChecked,
    isAllChecked,
    checkedItemsCount,
    handleSelectAll,
    handleClearSelected,
  } = props;
  const classes = useStyles(width);

  return (
    <div className={classes.virtualListSelectionHeaderDiv}>
      <div className={classes.checkboxFormContainer}>
        <FormControlLabel
          className={classes.checkbox}
          control={
            <Checkbox
              icon={<CheckBoxOutlined />}
              checked={isAllChecked}
              onChange={!isAllChecked ? handleSelectAll : handleClearSelected}
            />
          }
          label={!isAllChecked ? "Select all" : "Deselect all"}
        />
      </div>
      {isChecked && (
        <Button variant="text" onClick={handleClearSelected}>
          <Badge
            className={classes.badge}
            badgeContent={checkedItemsCount}
            color="secondary"
          >
            Clear selected
          </Badge>
        </Button>
      )}
    </div>
  );
};

export default VirtualListSelectionHeader;
