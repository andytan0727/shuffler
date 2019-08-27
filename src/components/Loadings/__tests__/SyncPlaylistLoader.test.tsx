import partial from "lodash/partial";
import React from "react";
import { renderWithRedux } from "utils/helper/mockStore";

import SyncPlaylistLoader from "../SyncPlaylistLoader";

const renderSyncPlaylistLoader = partial(
  renderWithRedux,
  <SyncPlaylistLoader open={true} />
);

describe("testing SyncPlaylistLoader UI renders", () => {
  describe("testing SyncPlaylistLoader open", () => {
    const { getByTestId } = renderSyncPlaylistLoader();

    const syncSnackbar = getByTestId("sync-playlist-loader");

    test("SyncPlaylistLoader should exists if open === true", () => {
      expect(syncSnackbar).toBeInTheDocument();
      expect(syncSnackbar).toHaveClass("MuiSnackbar-root");
    });

    test("should be placed on bottom right", () => {
      expect(syncSnackbar).toHaveClass("MuiSnackbar-anchorOriginBottomRight");
    });

    test("should have spinner inside it", () => {
      const spinner = syncSnackbar.querySelector(".MuiCircularProgress-root");
      expect(spinner).toHaveAttribute("role", "progressbar");
    });

    test("should have span with text 'syncing' inside it", () => {
      const syncingSpan = syncSnackbar.querySelector("span");
      expect(syncingSpan).toHaveTextContent("Syncing");
    });
  });
});
