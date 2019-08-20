import partial from "lodash/partial";
import React from "react";
import { AppState } from "store";
import {
  selectListToPlayPlaylistItemByItemId,
  selectListToPlayResult,
} from "store/ytplaylist/listToPlaySelectors";
import { DeepPartial } from "utility-types";
import { generateMockStore, renderWithRedux } from "utils/helper/mockStore";

import { fireEvent } from "@testing-library/react";

import AddPlaylistToPlayingBtn from "../AddPlaylistToPlayingBtn";

const playlistId = "playlistId-1";

// NOTE: this is a component that renders with the
// minimal redux store setup. This means that
// component that  renders with this partial function
// should not dispatch any actions
// To get component with dispatch-enabled actions,
// please supply a custom store
const renderAddPlaylistToPlayingBtn = partial(
  renderWithRedux,
  <AddPlaylistToPlayingBtn playlistId={playlistId} />
);

describe("testing AddPlaylistToPlayingBtn UI renders", () => {
  test("should render correctly with tooltip and icon", () => {
    const { container } = renderAddPlaylistToPlayingBtn();

    const addButtonElem = container.querySelector("button");

    // button exists in document
    // and has title attribute with the following value
    expect(addButtonElem).toBeInTheDocument();
    expect(addButtonElem).toHaveAttribute(
      "title",
      "Add Playlist to Now Playing"
    );
    expect(addButtonElem).toHaveAttribute("type", "button");

    const addIconElem = addButtonElem!.firstChild;

    // add icon exists
    // and is material ui svg icon with respective class
    expect(addIconElem).toBeInTheDocument();
    expect(addIconElem).toHaveClass("MuiIconButton-label");
  });
});

describe("testing AddPlaylistToPlayingBtn button clicks", () => {
  /**
   * format of playlistId/itemId of stateMaker
   * args: playlistId = 1
   *       itemId = 1
   * playlists states generated will have items with:
   *    itemId = itemId-{playlistId}-{itemId}
   *    snippetId = snippetId-{playlistId}-{itemId}
   * for details please refer to testUtils' makeItem function
   */
  test("should handle addPlaylistToListToPlay correctly when click event fired", () => {
    const initialState: DeepPartial<AppState> = {
      ytplaylist: {
        // initially empty listToPlay
        listToPlay: {
          entities: {
            playlistItems: {},
            videoItems: {},
          },
          result: [],
        },
        playlists: global.playlists,
      },
    };

    const storeWithPlaylists = generateMockStore(initialState);

    // renders with playlists state included
    const { container } = renderAddPlaylistToPlayingBtn(storeWithPlaylists);

    const addButtonElem = container.querySelector("button");
    expect(addButtonElem).toBeInTheDocument();

    // assert previous listToPlay result to be an empty array
    const prevListToPlayResult = selectListToPlayResult(
      storeWithPlaylists.getState() as AppState
    );
    expect(prevListToPlayResult.length).toBe(0);

    // click to dispatch ADD_PLAYLIST_TO_LIST_TO_PLAY action
    fireEvent.click(addButtonElem!);

    // listToPlay playlistItems should exists after the action dispatched
    const newlyAddedPlaylistInListToPlay = selectListToPlayPlaylistItemByItemId(
      storeWithPlaylists.getState() as AppState,
      "itemId-1-1"
    );
    const listToPlayResult = selectListToPlayResult(
      storeWithPlaylists.getState() as AppState
    );

    expect(newlyAddedPlaylistInListToPlay).toBeDefined();
    expect(listToPlayResult).toHaveLength(1);
  });
});
