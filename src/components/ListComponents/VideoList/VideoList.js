import React from "react";
import PropTypes from "prop-types";
import { FixedSizeList } from "react-window";

import styles from "./styles.module.scss";

class FixedSizeListItem extends React.PureComponent {
  render() {
    const { index, style, data } = this.props;

    return (
      <div className={styles.listItem} style={style}>
        {data[index].snippet.title}
      </div>
    );
  }
}

const getItemKey = (index, data) => data[index].id;

const VideoList = ({ items, width, height, children }) => (
  <FixedSizeList
    height={height || 350}
    className={styles.songList}
    itemCount={items.length}
    itemSize={65}
    itemData={items}
    itemKey={getItemKey}
    width={width || 400}
  >
    {children ? children : FixedSizeListItem}
  </FixedSizeList>
);

VideoList.propTypes = {
  items: PropTypes.array.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
};

export default VideoList;
