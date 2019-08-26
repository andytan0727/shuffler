import partial from "lodash/partial";
import React from "react";
import { renderWithRedux } from "utils/helper/mockStore";

import { fireEvent } from "@testing-library/react";

import RenamePlaylistButton from "../RenamePlaylistButton";

describe("testing RenamePlaylistButton UI renders", () => {
  const renderRenamePlaylistButton = partial(
    renderWithRedux,
    <RenamePlaylistButton
      // event handler functions are not concerned in this test
      handleRename={jest.fn()}
    />
  );

  test("should render rename button correctly", () => {
    const { getByTitle } = renderRenamePlaylistButton();

    const renameButtonElem = getByTitle(/rename/i);
    expect(renameButtonElem).toBeInTheDocument();
    expect(renameButtonElem).toHaveAttribute("type", "button");

    const renameIconElem = renameButtonElem!.firstChild;
    expect(renameIconElem).toBeInTheDocument();
    expect(renameIconElem).toHaveClass("MuiIconButton-label");
  });
});

describe("testing RenamePlaylistButton clicks", () => {
  const mockHandleRename = jest.fn();
  const renderRenamePlaylistButton = partial(
    renderWithRedux,
    <RenamePlaylistButton handleRename={mockHandleRename} />
  );

  test("should handle rename button click", () => {
    const { getByTitle } = renderRenamePlaylistButton();

    const renameButtonElem = getByTitle(/rename/i);
    expect(renameButtonElem).toBeInTheDocument();

    // test delete handler function
    fireEvent.click(renameButtonElem);

    expect(mockHandleRename).toHaveBeenCalledTimes(1);
  });
});
