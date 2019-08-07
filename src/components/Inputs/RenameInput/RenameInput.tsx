import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppState } from "store";
import {
  renamePlaylistAction,
  setCheckedPlaylistsAction,
} from "store/ytplaylist/action";
import { selectPlaylistName } from "store/ytplaylist/selector";

import styles from "./styles.module.scss";

interface OwnProps {
  id: string;
}

interface ConnectedStates {
  playlistName: string | undefined;
}

interface ConnectedDispatch {
  setCheckedPlaylistsAction: typeof setCheckedPlaylistsAction;
  renamePlaylistAction: typeof renamePlaylistAction;
}

type RenameInputProps = OwnProps & ConnectedStates & ConnectedDispatch;

const RenameInput = (props: RenameInputProps) => {
  const {
    // own props
    id,

    // connected state
    playlistName,

    // connected dispatch
    setCheckedPlaylistsAction,
    renamePlaylistAction,
  } = props;
  const [editName, setEditName] = useState({});

  // on videoItem span child
  const handleDoubleClick = useCallback(
    (playlistId: string) => () => {
      setEditName({
        [playlistId]: true,
      });

      setCheckedPlaylistsAction([playlistId]);
    },
    [setCheckedPlaylistsAction]
  );

  const handleEditNameInputChange = useCallback(
    (playlistId: string) => (e: InputChangeEvent) => {
      renamePlaylistAction(e.target.value, playlistId);
    },
    [renamePlaylistAction]
  );

  // clear input and checked checkbox after finished rename
  const handleEditNameInputBlur = useCallback(() => {
    setEditName({});
    setCheckedPlaylistsAction([]);
  }, [setCheckedPlaylistsAction]);

  // focus on currently selected playlist's input on double click
  useEffect(() => {
    const input: HTMLInputElement | null = document.querySelector(
      'input[name="edit-name"]'
    );
    if (Object.keys(editName).length && input) {
      input.focus();
    }
  }, [editName]);

  return (editName as PlainObject)[id] ? (
    <input
      className={classNames(styles.editNameInput, `edit-name-${id}`)}
      name="edit-name"
      value={playlistName}
      onChange={handleEditNameInputChange(id)}
      onBlur={handleEditNameInputBlur}
    />
  ) : (
    <span className={styles.editNameSpan} onDoubleClick={handleDoubleClick(id)}>
      {playlistName || `Playlist - ${id}`}
    </span>
  );
};

const mapStatesToProps = (state: AppState, props: OwnProps) => ({
  playlistName: selectPlaylistName(state as never, props.id),
});

export default connect(
  mapStatesToProps,
  {
    setCheckedPlaylistsAction,
    renamePlaylistAction,
  }
)(RenameInput);
