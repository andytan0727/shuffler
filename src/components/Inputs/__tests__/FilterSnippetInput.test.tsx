import partial from "lodash/partial";
import React from "react";
import { renderWithRedux } from "utils/helper/mockStore";

import FilterSnippetInput from "../FilterSnippetInput/FilterSnippetInput";

const itemIds = Array.from({ length: 5 }, (_, idx) => `itemId-${idx}`);

const renderFilterSnippetInput = partial(
  renderWithRedux,
  <FilterSnippetInput itemIds={itemIds} />
);

describe("testing FilterSnippetInput UI renders", () => {
  test("should render MUI dense outlined input correctly", () => {
    const { getByLabelText } = renderFilterSnippetInput();

    const inputElem = getByLabelText(/filter/i);
    expect(inputElem).toBeInTheDocument();
    expect(inputElem).toHaveClass("MuiOutlinedInput-input");
    expect(inputElem).toHaveClass("MuiOutlinedInput-inputMarginDense");
    expect(inputElem).toHaveAttribute("placeholder", "filter by title");
  });
});
