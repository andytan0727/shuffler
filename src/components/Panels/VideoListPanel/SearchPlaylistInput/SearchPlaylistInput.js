import { useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { notify } from "../../../../utils/helper/notifyHelper";
import {
  setPlaylistUrl,
  fetchPlaylistData,
  addFetchedItemId,
} from "../../../../store/ytapi/action";
import {
  addPlaylist,
  addPlayingPlaylists,
  addListToPlay,
} from "../../../../store/ytplaylist/action";

const SearchPlayListInput = (props) => {
  const {
    // redux states
    ytapi: {
      apiKey,
      playlistUrl,
      playlistItems: {
        apiBaseUrl,
        options: { part, maxResults, fields },
      },
      fetchedItemsId,
    },

    // dispatch
    setPlaylistUrl,
    fetchPlaylistData,
    addFetchedItemId,
    addPlaylist,
    addPlayingPlaylists,
    addListToPlay,

    // own props
    name,
    placeholder,
    children,
  } = props;
  const inputRef = useRef(null);

  const handlePlaylistInputChange = (e) => {
    setPlaylistUrl(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const listRegex = /^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?.*?(?:list)=(.*?)(?:&|$)|^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?(?:(?!=).)*\/(.*)$/;

    const regexResults = listRegex.exec(playlistUrl);

    const playlistId = regexResults && regexResults[1];

    if (inputRef && !inputRef.current.value) {
      notify("warning", "⚠️ Please don't submit empty input");
      return;
    }

    if (!playlistId) {
      notify("warning", "⚠️ Please enter a valid playlist url");
      return;
    }

    if (fetchedItemsId.includes(playlistId)) {
      notify("warning", "⚠️ You searched this before");
      return;
    }

    // array to store requested videos
    const items = [];

    try {
      let data = await fetchPlaylistData(
        apiBaseUrl,
        {
          part,
          maxResults,
          playlistId,
          fields,
          apiKey,
        },
        "playlist"
      );
      items.push(...data.items);
      let count = 2;

      while (data.nextPageToken) {
        if (count > 5) {
          alert(
            "Number of videos in your playlist exceeded limit set by us (250 videos/playlist)"
          );
          break;
        }

        data = await fetchPlaylistData(
          apiBaseUrl,
          {
            part,
            maxResults,
            playlistId,
            fields,
            pageToken: data.nextPageToken,
            apiKey,
          },
          "playlist"
        );
        items.push(...data.items);
        count++;
      }

      // add newly fetched playlist to Redux
      addPlaylist({
        persist: true,
        playlist: {
          id: playlistId,
          items,
        },
      });

      // add newly fetched playlist's song to listToPlay
      addListToPlay({
        persist: true,
        listToAdd: items,
      });

      // add fetched playlist id to playingPlaylists
      addPlayingPlaylists([playlistId], true);

      // add fetched playlist id to fetchedItemsId array
      addFetchedItemId({
        id: playlistId,
      });

      // clear input
      setPlaylistUrl("");
    } catch (err) {
      notify("error", "❌ Error in requesting playlist!");
      console.error(err);

      // clear input
      setPlaylistUrl("");
    }
  };

  const handleCancel = () => {
    setPlaylistUrl("");
  };

  return children({
    ref: inputRef,
    name,
    value: playlistUrl,
    handleOnChange: handlePlaylistInputChange,
    placeholder,
    handleSearch,
    handleCancel,
  });
};

SearchPlayListInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  ytapi: PropTypes.shape({
    apiKey: PropTypes.string,
    playlistUrl: PropTypes.string,
    playlistItems: PropTypes.shape({
      apiBaseUrl: PropTypes.string,
      options: PropTypes.shape({
        part: PropTypes.string.isRequired,
        maxResults: PropTypes.string.isRequired,
        fields: PropTypes.array.isRequired,
      }),
    }),
    fetchedItemsId: PropTypes.array,
  }),
  setPlaylistUrl: PropTypes.func.isRequired,
  fetchPlaylistData: PropTypes.func.isRequired,
  addFetchedItemId: PropTypes.func.isRequired,
  addPlaylist: PropTypes.func.isRequired,
  addListToPlay: PropTypes.func.isRequired,
};

const mapStatesToSearchPlaylistInput = ({ ytapi }) => ({
  ytapi,
});

export default connect(
  mapStatesToSearchPlaylistInput,
  {
    setPlaylistUrl,
    fetchPlaylistData,
    addFetchedItemId,
    addPlaylist,
    addPlayingPlaylists,
    addListToPlay,
  }
)(SearchPlayListInput);
