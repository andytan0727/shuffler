import React, { useCallback } from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { IconButton, Tooltip } from "@material-ui/core";
import { SearchOutlined as SearchOutlinedIcon } from "@material-ui/icons";

const SearchPlaylistBtn: React.FC<RouteComponentProps> = (
  props: RouteComponentProps
) => {
  const { history } = props;

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

export default withRouter(SearchPlaylistBtn);
