import React, { lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import VideoList from "../VideoList";

const LazyVideoList = lazy(() => import("../VideoList"));

const CombinedPlaylist = props => {
  const { listToPlay } = props;

  return (
    <React.Fragment>
      {listToPlay.length ? (
        <Suspense fallback={<div>loading playlist...</div>}>
          <LazyVideoList items={listToPlay} />
        </Suspense>
      ) : (
        <div>
          <h3>No video to play.</h3>
        </div>
      )}
    </React.Fragment>
  );
};

CombinedPlaylist.propTypes = {
  listToPlay: PropTypes.array.isRequired
};
const mapStateToProps = ({ ytplaylist: { listToPlay } }) => ({
  listToPlay
});

export default connect(
  mapStateToProps,
  {}
)(CombinedPlaylist);
