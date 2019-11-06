import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { IconButton, Tooltip } from "@material-ui/core";
import { SearchOutlined as SearchOutlinedIcon } from "@material-ui/icons";

const SearchPlaylistBtn: React.FC = () => {
  const history = useHistory();

  const handleOnClick = useCallback(() => {
    history.push("/panel/playlists");
  }, [history]);

  return (
    <Tooltip title="Go to Playlists panel">
      <IconButton onClick={handleOnClick}>
        <SearchOutlinedIcon fontSize="large" />
      </IconButton>
    </Tooltip>
  );
};

export default SearchPlaylistBtn;
