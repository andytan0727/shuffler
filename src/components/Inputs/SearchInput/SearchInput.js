import React, { useCallback } from "react";
import IconButton from "@material-ui/core/IconButton";
import { Search as SearchIcon, Cancel as CancelIcon } from "@material-ui/icons";

import { useSearchYT } from "../hooks";

import styles from "./styles.module.scss";

/**
 * SearchInput higher order component
 *
 * Higher order component which is used to generate either
 * SearchVideoInput or SearchPlaylistInput for InputTabs
 * based on which itemType (playlist/video) to search
 *
 * @param {ItemType} inputType
 *
 */
export const withSearchInput = (inputType) => () => {
  const {
    inputVal,
    setInputVal,
    handleInputChange,
    handleSearchYT,
  } = useSearchYT(inputType);

  const handleCancel = useCallback(() => {
    setInputVal("");
  }, [setInputVal]);

  return (
    <div className={styles.searchInput}>
      <input
        type="text"
        value={inputVal}
        placeholder={`Search ${inputType}...`}
        onChange={handleInputChange}
      />
      <IconButton onClick={handleSearchYT}>
        <SearchIcon />
      </IconButton>
      <IconButton onClick={handleCancel}>
        <CancelIcon />
      </IconButton>
    </div>
  );
};
