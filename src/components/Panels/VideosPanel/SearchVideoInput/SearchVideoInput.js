import { useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { notify } from "../../../../utils/helper/notifyHelper";
import {
  setVideoUrl,
  fetchVideoData,
  addFetchedVideoId,
} from "../../../../store/ytapi/action";
import {
  addVideo,
  addPlayingVideos,
  addListToPlay,
} from "../../../../store/ytplaylist/action";

const SearchVideoInput = (props) => {
  const {
    // redux states
    ytapi: {
      apiKey,
      videoUrl,
      videos: {
        apiBaseUrl,
        options: { part, maxResults, fields },
      },
      fetchedVideoId,
    },

    // dispatch
    setVideoUrl,
    fetchVideoData,
    addFetchedVideoId,
    addVideo,
    addPlayingVideos,
    addListToPlay,

    // own props
    name,
    placeholder,
    children,
  } = props;
  const inputRef = useRef(null);

  const handleVideoInputChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const vidRegex = /^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?.*?(?:v)=(.*?)(?:&|$)|^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?(?:(?!=).)*\/(.*)$/;

    const regexResults = vidRegex.exec(videoUrl);

    const videoId = regexResults && regexResults[1];

    if (inputRef && !inputRef.current.value) {
      notify("warning", "⚠️ Please don't submit empty input");
      return;
    }

    if (!videoId) {
      notify("warning", "⚠️ Please enter a valid video url");
      return;
    }

    if (fetchedVideoId.includes(videoId)) {
      notify("warning", "⚠️ You searched this before");
      return;
    }

    // array to store requested videos
    const items = [];

    try {
      let data = await fetchVideoData(
        apiBaseUrl,
        {
          part,
          maxResults,
          id: videoId,
          fields,
          apiKey,
        },
        "video"
      );
      items.push(...data.items);

      // add newly fetched video to Redux
      addVideo({
        persist: true,
        video: {
          id: videoId,
          items,
        },
      });

      // add newly fetched video to listToPlay
      addListToPlay({
        persist: true,
        listToAdd: items,
      });

      // add video id to playingVideos
      addPlayingVideos([videoId], true);

      // add fetched video id to fetchedVideoId array
      addFetchedVideoId({
        id: videoId,
      });

      // clear input
      setVideoUrl("");
    } catch (err) {
      notify("error", "❌ Error in requesting video!");
      console.error(err);

      // clear input
      setVideoUrl("");
    }
  };

  const handleCancel = () => {
    setVideoUrl("");
  };

  return children({
    ref: inputRef,
    name,
    value: videoUrl,
    handleOnChange: handleVideoInputChange,
    placeholder,
    handleSearch,
    handleCancel,
  });
};

SearchVideoInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  ytapi: PropTypes.shape({
    apiKey: PropTypes.string,
    videoUrl: PropTypes.string,
    videos: PropTypes.shape({
      apiBaseUrl: PropTypes.string,
      options: PropTypes.shape({
        part: PropTypes.string.isRequired,
        maxResults: PropTypes.string.isRequired,
        fields: PropTypes.array.isRequired,
      }),
    }),
    fetchedVideoId: PropTypes.array,
  }),
  setVideoUrl: PropTypes.func.isRequired,
  fetchVideoData: PropTypes.func.isRequired,
  addFetchedVideoId: PropTypes.func.isRequired,
  addVideo: PropTypes.func.isRequired,
  addListToPlay: PropTypes.func.isRequired,
};

const mapStatesToProps = ({ ytapi }) => ({
  ytapi,
});

export default connect(
  mapStatesToProps,
  {
    setVideoUrl,
    fetchVideoData,
    addFetchedVideoId,
    addVideo,
    addPlayingVideos,
    addListToPlay,
  }
)(SearchVideoInput);
