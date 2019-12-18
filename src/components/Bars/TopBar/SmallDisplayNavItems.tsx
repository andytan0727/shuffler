import React from "react";

import { IconButton } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";

import styles from "./styles.module.scss";
import TopBarNavItems from "./TopBarNavItems";

interface SmallDisplayNavItemsProps {
  handleToggleNavOverlay: (e: OnClickEvent) => void;
}

const SmallDisplayNavItems: React.FC<SmallDisplayNavItemsProps> = (
  props: SmallDisplayNavItemsProps
) => {
  const { handleToggleNavOverlay } = props;

  return (
    <React.Fragment>
      <IconButton className={styles.closeBtn} onClick={handleToggleNavOverlay}>
        <CloseIcon fontSize="large" />
      </IconButton>
      <TopBarNavItems />
    </React.Fragment>
  );
};

export default SmallDisplayNavItems;
