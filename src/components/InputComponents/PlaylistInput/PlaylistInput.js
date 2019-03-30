import React, { useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";

import { notify } from "../../../utils/helper/notifyHelper";

// dispatch
import {
  setPlaylistUrl,
  fetchPlaylistData,
  addFetchedItemId
} from "../../../store/ytapi/action";
import { addPlaylist, addListToPlay } from "../../../store/ytplaylist/action";

import styles from "./styles.module.scss";

const muiStyles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: 10,
    marginBottom: 20
  }
});

const PlaylistInput = props => {
  const {
    classes,
    handleSwipeDivIdxChange,

    // states
    ytapi: {
      apiKey,
      playlistUrl,
      playlistItems: {
        apiBaseUrl,
        options: { part, maxResults, fields }
      },
      fetchedItemsId
    },

    // dispatch
    setPlaylistUrl,
    fetchPlaylistData,
    addFetchedItemId,
    addPlaylist,
    addListToPlay
  } = props;
  const idInput = useRef(null);

  const handlePlaylistInputChange = e => {
    setPlaylistUrl(e.target.value);
  };

  const handleRequest = async e => {
    e.preventDefault();

    const listRegex = /^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?.*?(?:list)=(.*?)(?:&|$)|^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?(?:(?!=).)*\/(.*)$/;

    const vidRegex = /^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?.*?(?:v)=(.*?)(?:&|$)|^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?(?:(?!=).)*\/(.*)$/;

    const regexResults = listRegex.exec(playlistUrl);

    const requestId = regexResults && regexResults[1];

    if (idInput && !idInput.current.value) {
      notify("warning", "⚠️ Please don't submit empty input");
      return;
    }

    if (!requestId) {
      notify("warning", "⚠️ Please enter a valid playlist url");
      return;
    }

    if (fetchedItemsId.includes(requestId)) {
      notify("warning", "⚠️ You searched this before");
      return;
    }

    // array to store requested videos
    const items = [];

    try {
      let data = await fetchPlaylistData(apiBaseUrl, {
        part,
        maxResults,
        playlistId: requestId,
        fields,
        apiKey
      });
      items.push(...data.items);
      let count = 2;

      while (data.nextPageToken) {
        if (count > 5) {
          alert(
            "Number of videos in your playlist exceeded limit set by us (250 videos/playlist)"
          );
          break;
        }

        data = await fetchPlaylistData(apiBaseUrl, {
          part,
          maxResults,
          playlistId: requestId,
          fields,
          pageToken: data.nextPageToken,
          apiKey
        });
        items.push(...data.items);
        count++;
      }

      // add new playlist fetched to Redux
      addPlaylist({
        persist: true,
        playlist: {
          id: requestId,
          items
        }
      });

      // add newly fetched playlist's song to listToPlay
      addListToPlay({
        persist: true,
        listToAdd: items
      });

      // add fetched playlist id to fetchedItemsId array
      addFetchedItemId({
        id: requestId
      });

      // clear input
      setPlaylistUrl("");

      handleSwipeDivIdxChange(1);
    } catch (err) {
      notify("error", "❌ Error in requesting playlist!");
      console.error(err);

      // clear input
      setPlaylistUrl("");
    }
  };

  return (
    <div className={styles.playlistDiv}>
      <TextField
        inputRef={idInput}
        id="outlined-playlist-and-video"
        label="Playlist url"
        className={classes.textField}
        margin="normal"
        value={playlistUrl}
        onChange={handlePlaylistInputChange}
      />
      <IconButton aria-label="search" onClick={handleRequest}>
        <SearchIcon />
      </IconButton>
      <IconButton
        aria-label="cancel"
        onClick={handleSwipeDivIdxChange.bind(this, 1)}
      >
        <CancelIcon />
      </IconButton>
    </div>
  );
};

PlaylistInput.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSwipeDivIdxChange: PropTypes.func,
  apiKey: PropTypes.string,
  apiBaseUrl: PropTypes.string,
  playlistUrl: PropTypes.string,
  options: PropTypes.shape({
    part: PropTypes.string.isRequired,
    maxResults: PropTypes.string.isRequired,
    fields: PropTypes.string
  }),
  setPlaylistUrl: PropTypes.func.isRequired,
  fetchPlaylistData: PropTypes.func.isRequired,
  fetchedItemsId: PropTypes.array,
  addFetchedItemId: PropTypes.func.isRequired,
  addPlaylist: PropTypes.func.isRequired
};

const MUIPlaylistInput = withStyles(muiStyles)(PlaylistInput);

const mapStateToProps = ({ ytapi }) => ({
  ytapi
});

export default connect(
  mapStateToProps,
  {
    setPlaylistUrl,
    fetchPlaylistData,
    addFetchedItemId,
    addPlaylist,
    addListToPlay
  }
)(MUIPlaylistInput);
