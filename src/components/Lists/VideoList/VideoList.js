import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { VariableSizeList, FixedSizeList } from "react-window";

import styles from "./styles.module.scss";

class VideoListItem extends React.PureComponent {
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

const VideoList = forwardRef(function videoList(props, ref) {
  const { items, width, height, isMobile, children } = props;

  const getMobileListItemSize = (index) =>
    ((items[index].snippet.title.length * 16) / width) * 20;

  return isMobile ? (
    <VariableSizeList
      ref={ref}
      height={height || 350}
      className={styles.songList}
      itemCount={items.length}
      itemData={items}
      itemKey={getItemKey}
      itemSize={getMobileListItemSize}
      width={width || 400}
    >
      {children || VideoListItem}
    </VariableSizeList>
  ) : (
    <FixedSizeList
      ref={ref}
      height={height || 350}
      className={styles.songList}
      itemCount={items.length}
      itemData={items}
      itemKey={getItemKey}
      itemSize={90}
      width={width || 400}
    >
      {children || VideoListItem}
    </FixedSizeList>
  );
});

VideoList.propTypes = {
  items: PropTypes.array.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.number,
  isMobile: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default VideoList;
