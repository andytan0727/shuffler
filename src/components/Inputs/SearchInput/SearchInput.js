import React, { forwardRef } from "react";

// Material Icons
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import CancelIcon from "@material-ui/icons/Cancel";

import styles from "./styles.module.scss";

const SearchInput = forwardRef((props, ref) => {
  const {
    name,
    value,
    placeholder,
    handleOnChange,
    handleSearch,
    handleCancel,
  } = props;

  return (
    <div className={styles.searchInput}>
      <input
        ref={ref}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleOnChange}
        type="text"
      />
      <IconButton onClick={handleSearch}>
        <SearchIcon />
      </IconButton>
      <IconButton onClick={handleCancel}>
        <CancelIcon />
      </IconButton>
    </div>
  );
});

export default SearchInput;
