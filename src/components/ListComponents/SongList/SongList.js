import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import { FixedSizeList as List } from "react-window";

import styles from "./styles.module.scss";

const muiStyles = theme => ({
  list: {
    maxWidth: "60vw",
    maxHeight: "65vh",
    backgroundColor: theme.palette.background.paper,
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    overflow: "auto"
  }
});

class ListItem extends React.PureComponent {
  render() {
    const { index, style, data } = this.props;

    return (
      <div className={styles.listItem} style={style}>
        {data[index].snippet.title}
      </div>
    );
  }
}

const SongList = props => {
  const {
    ytplaylist: { listToPlay },
    classes
  } = props;

  return (
    <div className={styles.songListDiv}>
      {listToPlay.length !== 0 ? (
        <List
          height={350}
          className={styles.songList}
          itemCount={listToPlay.length}
          itemSize={65}
          itemData={listToPlay}
          itemKey={(index, data) => data[index].id}
          width={400}
        >
          {ListItem}
        </List>
      ) : (
        <div>
          <h3>No Playlist</h3>
        </div>
      )}
    </div>
  );
};

SongList.propTypes = {
  listToPlay: PropTypes.array,
  classes: PropTypes.object.isRequired
};

const StyledSongList = withStyles(muiStyles)(SongList);

const mapStateToProps = ({ ytplaylist }) => ({
  ytplaylist
});

export default connect(
  mapStateToProps,
  {}
)(StyledSongList);
