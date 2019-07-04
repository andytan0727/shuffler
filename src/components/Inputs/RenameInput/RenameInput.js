import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";

import {
  setCheckedPlaylistsAction,
  renamePlaylistAction,
} from "../../../store/ytplaylist/action";

import styles from "./styles.module.scss";

const RenameInput = (props) => {
  const {
    // own props
    id,
    name,

    // redux actions
    setCheckedPlaylistsAction,
    renamePlaylistAction,
  } = props;
  const [editName, setEditName] = useState({});

  // on videoItem span child
  const handleDoubleClick = (e) => {
    const selectedPlaylistId = e.currentTarget.getAttribute("data-playlistid");
    setEditName({
      [selectedPlaylistId]: true,
    });

    setCheckedPlaylistsAction([selectedPlaylistId]);
  };

  const handleEditNameInputChange = (e) => {
    const playlistId = e.target.getAttribute("data-playlistid");
    renamePlaylistAction(e.target.value, playlistId);
  };

  // clear input and checked checkbox after finished rename
  const handleEditNameInputBlur = () => {
    setEditName({});
    setCheckedPlaylistsAction([]);
  };

  // focus on currently selected playlist's input on double click
  useEffect(() => {
    /** @type {HTMLInputElement} */
    const input = document.querySelector('input[name="edit-name"]');
    if (Object.keys(editName).length && input) {
      input.focus();
    }
  }, [editName]);

  return editName[id] ? (
    <input
      className={classNames(styles.editNameInput, `edit-name-${id}`)}
      name="edit-name"
      value={name}
      onChange={handleEditNameInputChange}
      onBlur={handleEditNameInputBlur}
      data-playlistid={id}
    />
  ) : (
    <span
      className={styles.editNameSpan}
      onDoubleClick={handleDoubleClick}
      data-playlistid={id}
    >
      {name || `Playlist - ${id}`}
    </span>
  );
};

RenameInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  renamePlaylistAction: PropTypes.func.isRequired,
};

export default connect(
  null,
  {
    setCheckedPlaylistsAction,
    renamePlaylistAction,
  }
)(RenameInput);
