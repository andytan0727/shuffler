import { LgPanelCtrlBtnGroup } from "components/Buttons";
import { LgPanelCtrlBtnGroupProps } from "components/Buttons/BtnGroup/LgPanelCtrlBtnGroup";
import { FilterSnippetInput } from "components/Inputs";
import { FilterSnippetInputProps } from "components/Inputs/FilterSnippetInput";
import React from "react";

import styles from "./styles.module.scss";

type FilterAndCtrlBarProps = FilterSnippetInputProps & LgPanelCtrlBtnGroupProps;

const FilterAndCtrlBar = (props: FilterAndCtrlBarProps) => {
  const { itemIds, handlePlay, handleShuffle, handleDelete } = props;

  return (
    <div className={styles.controlDiv}>
      <FilterSnippetInput itemIds={itemIds} />
      <LgPanelCtrlBtnGroup
        handlePlay={handlePlay}
        handleShuffle={handleShuffle}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default FilterAndCtrlBar;
