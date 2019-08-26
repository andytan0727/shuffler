import partial from "lodash/partial";
import React from "react";
import { AppState } from "store";
import { selectListToPlayResult } from "store/ytplaylist/listToPlaySelectors";
import { DeepPartial } from "utility-types";
import { generateMockStore, renderWithRedux } from "utils/helper/mockStore";

import { fireEvent } from "@testing-library/react";

import RemovePlaylistFromPlayingBtn from "../RemovePlaylistFromPlayingBtn";

const playlistId = "playlistId-1";

// NOTE: this is a component that renders with the
// minimal redux store setup. This means that
// component that  renders with this partial function
// should not dispatch any actions
// To get component with dispatch-enabled actions,
// please supply a custom store
const renderRemovePlaylistFromPlayingBtn = partial(
  renderWithRedux,
  <RemovePlaylistFromPlayingBtn playlistId={playlistId} />
);

describe("testing RemovePlaylistFromPlayingBtn UI renders", () => {
  test("should render correctly with tooltip and icon", () => {
    const { container } = renderRemovePlaylistFromPlayingBtn();

    const removeButtonElem = container.querySelector("button");

    // button exists in document
    // and has title attribute with the following value
    expect(removeButtonElem).toBeInTheDocument();
    expect(removeButtonElem).toHaveAttribute(
      "title",
      expect.stringMatching(/remove\splaylist/i)
    );
    expect(removeButtonElem).toHaveAttribute("type", "button");

    const removeIconElem = removeButtonElem!.firstChild;

    // assert icon exists
    expect(removeIconElem).toBeInTheDocument();
    expect(removeIconElem).toHaveClass("MuiIconButton-label");
  });
});

describe("testing RemovePlaylistFromPlayingBtn button clicks", () => {
  const playlistId = "playlistId-1";
  const playlistItemId = "itemId-1-1";
  const playlistSnippetId = "snippetId-1-1";
  let initialState: DeepPartial<AppState>;
  let storeWithPlaylistAndListToPlay: ReturnType<typeof generateMockStore>;

  beforeEach(() => {
    // initial state containing:
    // - one playlist with one item and one snippet
    // - one listToPlay playlistItem
    initialState = {
      ytplaylist: {
        playlists: {
          entities: {
            playlistItems: {
              [playlistItemId]: {
                id: playlistItemId,
                snippet: playlistSnippetId,
              },
            },
            playlists: {
              [playlistId]: {
                id: playlistId,
                items: [playlistItemId],
              },
            },
            snippets: {
              [playlistSnippetId]: {
                id: playlistSnippetId,
                title: "sample",
                playlistId,
                itemId: playlistItemId,
              },
            },
          },
          result: [playlistId],
        },
        listToPlay: {
          entities: {
            playlistItems: {
              [playlistItemId]: {
                id: playlistItemId,
                foreignKey: playlistId,
              },
            },
          },
          result: [
            {
              id: playlistItemId,
              schema: "playlistItems",
            },
          ],
        },
      },
    };

    storeWithPlaylistAndListToPlay = generateMockStore(initialState);
  });

  test("should handle removePlaylistFromListToPlay correctly when click event fired", () => {
    const { container } = renderRemovePlaylistFromPlayingBtn(
      storeWithPlaylistAndListToPlay
    );

    const removeButtonElem = container.querySelector("button");
    expect(removeButtonElem).toBeInTheDocument();

    // assert previous listToPlay result to have an item
    const prevListToPlayResult = selectListToPlayResult(
      storeWithPlaylistAndListToPlay.getState() as AppState
    );
    expect(prevListToPlayResult.length).toBe(1);

    // click to dispatch REMOVE_PLAYLIST_FROM_LIST_TO_PLAY action
    fireEvent.click(removeButtonElem!);

    // listToPlay playlistItems should be removed after the action dispatched
    const nextListToPlayResult = selectListToPlayResult(
      storeWithPlaylistAndListToPlay.getState() as AppState
    );
    expect(nextListToPlayResult).toHaveLength(0);
  });
});
