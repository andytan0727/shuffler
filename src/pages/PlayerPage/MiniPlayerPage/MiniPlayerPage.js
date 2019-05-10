import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MiniPlayer from "../../../components/Players/Video/MiniPlayer";
import NoVideoFound from "../NoVideoFound";

const MiniPlayerPage = (props) => {
  const { listToPlay } = props;

  return listToPlay.length !== 0 ? (
    <div>
      <MiniPlayer />
    </div>
  ) : (
    <NoVideoFound />
  );
};

MiniPlayerPage.propTypes = {
  listToPlay: PropTypes.array.isRequired,
};

const mapStateToProps = ({ ytplaylist: { listToPlay } }) => ({
  listToPlay,
});

export default connect(
  mapStateToProps,
  {}
)(MiniPlayerPage);
