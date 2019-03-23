import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// dispatch
import { setPlaylistId, addFetchedData } from "../../../store/ytapi/action";
import { addPlaylist } from "../../../store/ytplaylist/action";

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
      }
    },

    // dispatch
    setPlaylistId,
    addFetchedData,
    addPlaylist
  } = props;

  const handlePlaylistIdChange = e => {
    setPlaylistId(e.target.value);
  };

  const handleRequest = async e => {
    e.preventDefault();

    const items = [];

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
    try {
      let data = await addFetchedData("data1.json", {
        part,
        maxResults,
        playlistId,
        fields,
        apiKey
      });
      items.push(...data.items);
      let count = 2;

      while (data.nextPageToken) {
        console.log(data.nextPageToken);
        data = await addFetchedData(`data${count}.json`, {
          part,
          maxResults,
          playlistId,
          fields,
          apiKey
        });
        items.push(...data.items);
        console.log(`push ${count}`);
        count++;

        if (count > 5) {
          console.log("nextPageToken failed");
          break;
        }
      }
      console.log("finished. Add playlist to redux store");
      addPlaylist({
        id: playlistId,
        items
      });

      // swipe to ctrl btn group
      handleSwipeDivIdxChange(1);
    } catch (err) {
      console.log("Error in axios request!");
      console.log(err);
      alert("Error! Please try again");
    }
  };

  return (
    <div className={styles.playlistDiv}>
      <TextField
        id="outlined-playlist-and-song"
        label="Playlist or Song Url"
        className={classes.textField}
        margin="normal"
        // variant="standard"
        onChange={handlePlaylistIdChange}
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
  handleSwipeDivIdxChange: PropTypes.func.isRequired,
  apiKey: PropTypes.string,
  playlistItems: PropTypes.object,
  options: PropTypes.shape({
    part: PropTypes.string.isRequired,
    maxResults: PropTypes.string.isRequired,
    playlistId: PropTypes.string,
    fields: PropTypes.string
  }),
  setPlaylistId: PropTypes.func.isRequired,
  addFetchedData: PropTypes.func.isRequired,
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
    addFetchedData,
    addPlaylist
  }
)(MUIPlaylistInput);
