import { useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { notify } from "../../../utils/helper/notifyHelper";
import {
  setPlaylistUrlAction,
  fetchPlaylistDataAction,
} from "../../../store/ytapi/action";

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
      fetchedPlaylistId,
    },

    // dispatch
    setPlaylistUrlAction,
    fetchPlaylistDataAction,

    // own props
    name,
    placeholder,
    children,
  } = props;
  const inputRef = useRef(null);

  const handlePlaylistInputChange = (e) => {
    setPlaylistUrlAction(e.target.value);
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

    if (fetchedPlaylistId.includes(playlistId)) {
      notify("warning", "⚠️ You searched this before");
      return;
    }

    fetchPlaylistDataAction(apiBaseUrl, {
      part,
      maxResults,
      playlistId,
      fields,
      apiKey,
    });
  };

  const handleCancel = () => {
    setPlaylistUrlAction("");
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
    fetchedPlaylistId: PropTypes.array,
  }),
  setPlaylistUrlAction: PropTypes.func.isRequired,
  fetchPlaylistDataAction: PropTypes.func.isRequired,
};

const mapStatesToSearchPlaylistInput = ({ ytapi }) => ({
  ytapi,
});

export default connect(
  mapStatesToSearchPlaylistInput,
  {
    setPlaylistUrlAction,
    fetchPlaylistDataAction,
  }
)(SearchPlayListInput);
