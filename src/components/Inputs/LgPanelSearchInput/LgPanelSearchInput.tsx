import React from "react";

import { Button } from "@material-ui/core";
import { SearchOutlined as SearchOutlinedIcon } from "@material-ui/icons";

import { useSearchYT } from "../hooks";
import styles from "./styles.module.scss";

/**
 * makeLgPanelSearchInput
 *
 * Factory which is used to generate either
 * SearchVideoInput or SearchPlaylistInput for LgPanels
 * based on which inputType (playlists/videos) to search
 *
 * @param inputType
 *
 */
export const makeLgPanelSearchInput = (inputType: MediaSourceType) =>
  function LgPanelSearchInput() {
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
