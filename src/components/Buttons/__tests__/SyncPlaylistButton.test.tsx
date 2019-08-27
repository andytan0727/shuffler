import partial from "lodash/partial";
import React from "react";
import { renderWithRedux } from "utils/helper/mockStore";

import { fireEvent } from "@testing-library/react";

import SyncPlaylistButton from "../SyncPlaylistButton";

describe("testing SyncPlaylistButton UI renders", () => {
  const renderSyncPlaylistButton = partial(
    renderWithRedux,
    <SyncPlaylistButton handleSyncPlaylist={jest.fn()} />
  );

  test("should render SyncPlaylistButton correctly", () => {
    const { getByTitle } = renderSyncPlaylistButton();

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

describe("testing SyncPlaylistButton clicks", () => {
  const mockHandleSyncPlaylist = jest.fn();
  const renderSyncPlaylistButton = partial(
    renderWithRedux,
    <SyncPlaylistButton handleSyncPlaylist={mockHandleSyncPlaylist} />
  );

  test("should handle sync playlist function click correctly", () => {
    const { getByTitle } = renderSyncPlaylistButton();

    const syncButtonElem = getByTitle(/sync/i);

    expect(syncButtonElem).toBeInTheDocument();

    fireEvent.click(syncButtonElem);

    expect(mockHandleSyncPlaylist).toHaveBeenCalledTimes(1);
  });
});
