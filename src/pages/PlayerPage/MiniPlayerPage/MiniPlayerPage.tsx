import React from "react";
import { connect } from "react-redux";
import { DeepReadonly } from "utility-types";
import { AppState } from "store";
import { selectListToPlay } from "store/ytplaylist/selector";
import { PlaylistItem, VideoItem } from "store/ytplaylist/types";
import { MiniPlayer } from "components/Players";
import NoVideoFound from "../NoVideoFound";

interface MiniPlayerPageConnectedState {
  listToPlay: DeepReadonly<(PlaylistItem | VideoItem)[]>;
}

type MiniPlayerPageProps = MiniPlayerPageConnectedState;

const MiniPlayerPage = (props: MiniPlayerPageProps) => {
  const { listToPlay } = props;

  return listToPlay.length !== 0 ? (
    <div>
      <MiniPlayer />
    </div>
  ) : (
    <NoVideoFound />
  );
};

const mapStateToProps = (state: AppState) => ({
  listToPlay: selectListToPlay(state),
});

export default connect(
  mapStateToProps,
  {}
)(MiniPlayerPage);
