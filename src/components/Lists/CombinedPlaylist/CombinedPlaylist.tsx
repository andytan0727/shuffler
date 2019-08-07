import React, { lazy, Suspense } from "react";
import { connect } from "react-redux";
import { AppState } from "store";
import { selectListToPlay } from "store/ytplaylist/selector";
import { ListToPlayItems } from "store/ytplaylist/types";
import { retryLazy } from "utils/helper/lazyImportHelper";

import { useMediaQuery } from "@material-ui/core";

interface CombinedPlaylistConnectedState {
  listToPlay: ListToPlayItems;
}

type CombinedPlaylistProps = CombinedPlaylistConnectedState;

const LazyVideoList = lazy(() => retryLazy(() => import("../VideoList")));

const CombinedPlaylist = (props: CombinedPlaylistProps) => {
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

const mapStateToProps = (state: AppState) => ({
  listToPlay: selectListToPlay(state),
});

export default connect(
  mapStateToProps,
  {}
)(CombinedPlaylist);
