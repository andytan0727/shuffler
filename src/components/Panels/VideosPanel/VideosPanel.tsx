import { VideosPanelBtnGroup } from "components/Buttons";
import { useCheckbox } from "components/Checkbox/hooks";
import { makeSearchInput } from "components/Inputs";
import React from "react";
import { useSelector } from "react-redux";
import { selectAllNormVideoItemIds } from "store/ytplaylist/normSelector";

import styles from "./styles.module.scss";
import VideosPanelItem from "./VideosPanelItem";

const SearchVideoInput = makeSearchInput("videos");

const VideosPanel = () => {
  const itemIds = useSelector(selectAllNormVideoItemIds);
  const { checked, handleSetChecked, clearChecked } = useCheckbox();

  return (
    <React.Fragment>
      <div className={styles.videosPanelDiv}>
        <SearchVideoInput />
        <div className={styles.videos}>
          {itemIds.length !== 0 ? (
            itemIds.map((itemId) => (
              <VideosPanelItem
                key={itemId}
                checked={checked}
                handleSetChecked={handleSetChecked}
                itemId={itemId}
              />
            ))
          ) : (
            <div>
              <h3
                style={{
                  textAlign: "center",
                }}
              >
                No Video Found
              </h3>
            </div>
          )}
        </div>

        <VideosPanelBtnGroup checked={checked} clearChecked={clearChecked} />
      </div>
    </React.Fragment>
  );
};

export default VideosPanel;
