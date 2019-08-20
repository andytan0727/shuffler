import partial from "lodash/partial";
import React from "react";
import { renderWithRedux } from "utils/helper/mockStore";

import VideosPanelBtnGroup from "../VideosPanelBtnGroup";

describe("testing VideosPanelBtnGroup UI renders", () => {
  const renderVideosPanelBtnGroup = partial(
    renderWithRedux,
    <VideosPanelBtnGroup checked={["sample"]} clearChecked={jest.fn()} />
  );

  test("should render add button correctly", () => {
    const { container } = renderVideosPanelBtnGroup();

    const addButtonElem = container.querySelectorAll("button")[0];
    expect(addButtonElem).toBeInTheDocument();
    expect(addButtonElem).toHaveAttribute(
      "data-tooltip",
      expect.stringMatching(/add\sto\splaying/i)
    );

    const addIconElem = addButtonElem.firstChild;
    expect(addIconElem).toBeInTheDocument();
    expect(addIconElem).toHaveClass("MuiSvgIcon-root");
  });

  test("should render remove button correctly", () => {
    const { container } = renderVideosPanelBtnGroup();

    const removeButtonElem = container.querySelectorAll("button")[1];
    expect(removeButtonElem).toBeInTheDocument();
    expect(removeButtonElem).toHaveAttribute(
      "data-tooltip",
      expect.stringMatching(/remove\sfrom/i)
    );

    const removeIconElem = removeButtonElem.firstChild;
    expect(removeIconElem).toBeInTheDocument();
    expect(removeIconElem).toHaveClass("MuiSvgIcon-root");
  });

  test("should render delete button correctly", () => {
    const { container } = renderVideosPanelBtnGroup();

    const deleteButtonElem = container.querySelectorAll("button")[2];
    expect(deleteButtonElem).toBeInTheDocument();
    expect(deleteButtonElem).toHaveAttribute(
      "data-tooltip",
      expect.stringMatching(/delete\svideo/i)
    );

    const deleteIconElem = deleteButtonElem.firstChild;
    expect(deleteIconElem).toBeInTheDocument();
    expect(deleteIconElem).toHaveClass("MuiSvgIcon-root");
  });
});
