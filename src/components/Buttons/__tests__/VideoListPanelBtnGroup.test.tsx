import partial from "lodash/partial";
import React from "react";
import { renderWithRedux } from "utils/helper/mockStore";

import VideoListPanelBtnGroup from "../BtnGroup/VideoListPanelBtnGroup";

describe("testing VideoListPanelBtnGroup UI renders", () => {
  const renderVideoListPanelBtnGroup = partial(
    renderWithRedux,
    <VideoListPanelBtnGroup
      checked={["sample"]}
      clearChecked={jest.fn()}
      setViewPlaylist={jest.fn()}
    />
  );

  test("should render add button correctly", () => {
    const { container } = renderVideoListPanelBtnGroup();

    const addButtonElem = container.querySelectorAll("button")[0];
    expect(addButtonElem).toBeInTheDocument();
    expect(addButtonElem).toHaveAttribute(
      "data-tooltip",
      expect.stringMatching(/add\sto/i)
    );

    const addIconElem = addButtonElem.firstChild;
    expect(addIconElem).toBeInTheDocument();
    expect(addIconElem).toHaveClass("MuiSvgIcon-root");
  });

  test("should render remove button correctly", () => {
    const { container } = renderVideoListPanelBtnGroup();

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
    const { container } = renderVideoListPanelBtnGroup();

    const deleteButtonElem = container.querySelectorAll("button")[2];
    expect(deleteButtonElem).toBeInTheDocument();
    expect(deleteButtonElem).toHaveAttribute(
      "data-tooltip",
      expect.stringMatching(/remove\splaylist/i)
    );

    const deleteIconElem = deleteButtonElem.firstChild;
    expect(deleteIconElem).toBeInTheDocument();
    expect(deleteIconElem).toHaveClass("MuiSvgIcon-root");
  });

  test("should render view list button correctly", () => {
    const { container } = renderVideoListPanelBtnGroup();

    const viewListButtonElem = container.querySelectorAll("button")[3];
    expect(viewListButtonElem).toBeInTheDocument();
    expect(viewListButtonElem).toHaveAttribute(
      "data-tooltip",
      expect.stringMatching(/view\splaylist/i)
    );

    const viewListIconElem = viewListButtonElem.firstChild;
    expect(viewListIconElem).toBeInTheDocument();
    expect(viewListIconElem).toHaveClass("MuiSvgIcon-root");
  });
});
