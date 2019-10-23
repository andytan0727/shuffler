import partial from "lodash/partial";
import React from "react";
import { renderWithRedux } from "utils/helper/mockStore";

import { fireEvent } from "@testing-library/react";

import SyncPlaylistBtn from "../SyncPlaylistBtn";

describe("testing SyncPlaylistBtn UI renders", () => {
  const renderSyncPlaylistBtn = partial(
    renderWithRedux,
    <SyncPlaylistBtn handleSyncPlaylist={jest.fn()} />
  );

  test("should render SyncPlaylistBtn correctly", () => {
    const { getByTitle } = renderSyncPlaylistBtn();

    const syncButtonElem = getByTitle(/sync/i);

    // button exists in document
    expect(syncButtonElem).toBeInTheDocument();
    expect(syncButtonElem).toHaveAttribute("type", "button");

    const syncIconElem = syncButtonElem!.firstChild;

    // add icon exists
    // and is material ui svg icon with respective class
    expect(syncIconElem).toBeInTheDocument();
    expect(syncIconElem).toHaveClass("MuiIconButton-label");
  });
});

describe("testing SyncPlaylistBtn clicks", () => {
  const mockHandleSyncPlaylist = jest.fn();
  const renderSyncPlaylistBtn = partial(
    renderWithRedux,
    <SyncPlaylistBtn handleSyncPlaylist={mockHandleSyncPlaylist} />
  );

  test("should handle sync playlist function click correctly", () => {
    const { getByTitle } = renderSyncPlaylistBtn();

    const syncButtonElem = getByTitle(/sync/i);

    expect(syncButtonElem).toBeInTheDocument();

    fireEvent.click(syncButtonElem);

    expect(mockHandleSyncPlaylist).toHaveBeenCalledTimes(1);
  });
});
