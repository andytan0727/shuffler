import { ManagementPanelCtrlBtnGroup } from "components/Buttons";
import { ManagementPanelCtrlBtnGroupProps } from "components/Buttons/ManagementPanelCtrlBtnGroup";
import { FilterSnippetInput } from "components/Inputs";
import { FilterSnippetInputProps } from "components/Inputs/FilterSnippetInput";
import React from "react";

import styles from "./styles.module.scss";

type ManagementFilterAndCtrlBarProps = FilterSnippetInputProps &
  ManagementPanelCtrlBtnGroupProps;

const ManagementFilterAndCtrlBar = (props: ManagementFilterAndCtrlBarProps) => {
  const { itemIds, handlePlay, handleShuffle, handleDelete } = props;

  return (
    <div className={styles.controlDiv}>
      <FilterSnippetInput itemIds={itemIds} />
      <ManagementPanelCtrlBtnGroup
        handlePlay={handlePlay}
        handleShuffle={handleShuffle}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default ManagementFilterAndCtrlBar;
