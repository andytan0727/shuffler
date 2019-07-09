import React from "react";
import { Button } from "@material-ui/core";
import { SearchOutlined as SearchOutlinedIcon } from "@material-ui/icons";

import { useSearchYT } from "../hooks";

import styles from "./styles.module.scss";

/**
 * ManagementPanelSearchInput higher order component
 *
 * Higher order component which is used to generate either
 * SearchVideoInput or SearchPlaylistInput for ManagementPanels
 * based on which inputType (playlist/video) to search
 *
 * @param {ItemType} inputType
 *
 */
export const withManagementPanelSearchInput = (inputType) => () => {
  const { inputVal, handleInputChange, handleSearchYT } = useSearchYT(
    inputType
  );

  return (
    <div className={styles.searchInputDiv}>
      <input
        className={styles.searchInput}
        type="text"
        value={inputVal}
        onChange={handleInputChange}
        placeholder={`Search ${inputType}...`}
      />
      <Button className={styles.searchButton} onClick={handleSearchYT}>
        <SearchOutlinedIcon />
      </Button>
    </div>
  );
};
