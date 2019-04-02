import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { VariableSizeList } from "react-window";

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
  const perLine = width / 15;

  const getMobileListItemSize = (index) =>
    ((items[index].snippet.title.length * 16) / width) * 20;

  const getListItemSize = (index) => {
    const titleLen = items[index].snippet.title.length;

    return titleLen > perLine + 10 ? (titleLen / perLine) * 2.5 * 16 : 70;
  };

  return (
    <VariableSizeList
      ref={ref}
      height={height || 350}
      className={styles.songList}
      itemCount={items.length}
      itemData={items}
      itemKey={getItemKey}
      itemSize={isMobile ? getMobileListItemSize : getListItemSize}
      width={width || 400}
    >
      {children || VideoListItem}
    </VariableSizeList>
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
