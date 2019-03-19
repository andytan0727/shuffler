import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

// dispatch
import { setPlaylistId, addFetchedData } from "../../../store/ytapi/action";
import { addPlaylist } from "../../../store/ytplaylist/action";

import styles from "./styles.module.scss";

const muiStyles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

const PlaylistInput = props => {
  const {
    classes,

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
    } catch (err) {
      console.log("Error in axios request!");
      console.log(err);
      alert("Error! Please try again");
    }
  };

  return (
    <div className={styles.playlistDiv}>
      <div>
        <ul className={styles.list}>
          <li>
            <TextField
              id="outlined-playlist"
              label="Playlist"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              onChange={handlePlaylistIdChange}
            />
          </li>
          <li>
            <Typography variant="h5" align="center">
              -- or --
            </Typography>
          </li>
          <li>
            <TextField
              id="outlined-song"
              label="Song"
              // className={classes.textField}
              margin="normal"
              variant="outlined"
            />
          </li>
        </ul>
      </div>
      <Button
        variant="contained"
        color="secondary"
        aria-label="Start"
        onClick={handleRequest}
      >
        Start
      </Button>
    </div>
  );
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
