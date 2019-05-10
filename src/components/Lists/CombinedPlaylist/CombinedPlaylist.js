import React, { lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import { retryLazy } from "../../../utils/helper/lazyImportHelper";

const LazyVideoList = lazy(() => retryLazy(() => import("../VideoList")));

const CombinedPlaylist = (props) => {
  const { listToPlay } = props;
  const matchesMobile = useMediaQuery("(max-width: 420px)");

  return (
    <React.Fragment>
      {listToPlay.length ? (
        <Suspense fallback={<div>loading playlist...</div>}>
          {matchesMobile ? (
            <LazyVideoList items={listToPlay} width={250} isMobile />
          ) : (
            <LazyVideoList items={listToPlay} width={400} />
          )}
        </Suspense>
      ) : (
        <div>
          <h3>No video to play? Add something.</h3>
        </div>
      )}
    </React.Fragment>
  );
};

CombinedPlaylist.propTypes = {
  listToPlay: PropTypes.array.isRequired,
};
const mapStateToProps = ({ ytplaylist: { listToPlay } }) => ({
  listToPlay,
});

export default connect(
  mapStateToProps,
  {}
)(CombinedPlaylist);
