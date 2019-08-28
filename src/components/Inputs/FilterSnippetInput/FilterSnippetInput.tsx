import React from "react";

import TextField from "@material-ui/core/TextField";

import useFilter from "../hooks/useFilter";

export interface FilterSnippetInputProps {
  itemIds: string[];
  uniqueIdentifier?: string;
}

const FilterSnippetInput = (props: FilterSnippetInputProps) => {
  const { itemIds, uniqueIdentifier } = props;
  const { filterValue, handleFilter } = useFilter(itemIds, uniqueIdentifier);

  return (
    <TextField
      id="filter"
      value={filterValue}
      label="filter"
      placeholder="filter by title"
      onChange={handleFilter}
      margin="dense"
      variant="outlined"
    />
  );
};

export default FilterSnippetInput;
