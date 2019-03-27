import React, { useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// dispatch
import {
  setPlaylistId,
  fetchPlaylistData,
  addFetchedItemId
} from "../../../store/ytapi/action";
import { addPlaylist, addListToPlay } from "../../../store/ytplaylist/action";

import styles from "./styles.module.scss";

const muiStyles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: 20,
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
      playlistItems,
      playlistItems: {
        options: { part, maxResults, playlistId, fields }
      },
      fetchedItemsId
    },

    // dispatch
    setPlaylistId,
    fetchPlaylistData,
    addFetchedItemId,
    addPlaylist,
    addListToPlay
  } = props;
  const idInput = useRef(null);

  const handlePlaylistInputChange = e => {
    setPlaylistId(e.target.value);
  };

  const handleRequest = async e => {
    e.preventDefault();

    const items = [];

    if (idInput && !idInput.current.value) {
      alert("Please don't submit empty input");
      return;
    }

    if (fetchedItemsId.includes(playlistId)) {
      alert("Please enter new playlistId / song Url");
      return;
    }

    // if (playlistId) {
    //   try {
    //     const data = await fetchPlaylistItems(playlistItems.apiBaseUrl, {
    //       part,
    //       maxResults,
    //       playlistId,
    //       fields,
    //       apiKey
    //     });
    //     console.log(data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    /**
     * API MOCK TESTING IN LOCAL ENV
     */
    // swipe to ctrl btn group first for better UX
    handleSwipeDivIdxChange(1);

    try {
      // fetch and add data to Redux store
      let data = await fetchPlaylistData("data1.json", {
        part,
        maxResults,
        playlistId,
        fields,
        apiKey
      });

      items.push(...data.items);
      let count = 2;

      while (data.nextPageToken) {
        data = await fetchPlaylistData(`data${count}.json`, {
          part,
          maxResults,
          playlistId,
          fields,
          apiKey
        });
        items.push(...data.items);
        count++;

        if (count > 5) {
          console.log("nextPageToken failed");
          break;
        }
      }

      // add new playlist fetched to Redux
      addPlaylist({
        persist: true,
        playlist: {
          id: playlistId,
          items
        }
      });

      // add newly fetched playlist's song to listToPlay
      addListToPlay({
        persist: true,
        listToAdd: items
      })

      // add fetched playlist id to fetchedItemsId array
      addFetchedItemId({
        persist: true,
        id: playlistId
      });

      // clear input
      setPlaylistId("");
    } catch (err) {
      console.log("Error in axios request!");
      console.log(err);
      alert("Error! Please try again");
    }
  };

  return (
    <div className={styles.playlistDiv}>
      <TextField
        inputRef={idInput}
        id="outlined-playlist-and-song"
        label="Playlist or Song Url"
        className={classes.textField}
        margin="normal"
        value={playlistId}
        onChange={handlePlaylistInputChange}
      />
      <Button
        variant="contained"
        color="secondary"
        aria-label="Start"
        onClick={handleRequest}
      >
        GO
      </Button>
    </div>
  );
};

PlaylistInput.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSwipeDivIdxChange: PropTypes.func,
  apiKey: PropTypes.string,
  playlistItems: PropTypes.object,
  options: PropTypes.shape({
    part: PropTypes.string.isRequired,
    maxResults: PropTypes.string.isRequired,
    playlistId: PropTypes.string,
    fields: PropTypes.string
  }),
  setPlaylistId: PropTypes.func.isRequired,
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
    setPlaylistId,
    fetchPlaylistData,
    addFetchedItemId,
    addPlaylist,
    addListToPlay
  }
)(MUIPlaylistInput);
