import partial from "lodash/partial";
import React from "react";
import { AppState } from "store";
import {
  selectListToPlayPlaylistItems,
  selectListToPlayResult,
} from "store/ytplaylist/listToPlaySelectors";
import { DeepPartial } from "utility-types";
import { generateMockStore, renderWithRedux } from "utils/helper/mockStore";

import { fireEvent, wait, waitForElement } from "@testing-library/react";

import PlayingPanelBtnGroup from "../BtnGroup/PlayingPanelBtnGroup";

// mocking scrollTo to prevent jsdom not implemented err0r
window.scrollTo = jest.fn();

const mockHistory: string[] = [];

jest.mock("react-router", () => ({
  withRouter: (Comp: React.ComponentType) => {
    const MockedRoutedComponent = (props: any) => (
      <Comp
        {...props}
        history={mockHistory} // mock react router history item
      />
    );

    return MockedRoutedComponent;
  },
}));

// NOTE: this is a component that renders with the
// minimal redux store setup. This means that
// component that  renders with this partial function
// should not dispatch any actions
// To get component with dispatch-enabled actions,
// please supply a custom store
const renderPlayingPanelBtnGroup = partial(
  renderWithRedux,
  <PlayingPanelBtnGroup />
);

describe("testing PlayingPanelBtnGroup UI renders", () => {
  test("should render play button with icons correctly", () => {
    const { container } = renderPlayingPanelBtnGroup();

    const playButtonElem = container.querySelectorAll("button")[0];
    expect(playButtonElem).toBeInTheDocument();
    expect(playButtonElem).toHaveAttribute(
      "data-tooltip",
      expect.stringMatching(/play/i)
    );

    const playArrowIconElem = playButtonElem.firstChild;
    expect(playArrowIconElem).toBeInTheDocument();
    expect(playArrowIconElem).toHaveClass("MuiSvgIcon-root");
  });

  test("should render shuffle button with icons correctly", () => {
    const { container } = renderPlayingPanelBtnGroup();

    const shuffleButtonElem = container.querySelectorAll("button")[1];
    expect(shuffleButtonElem).toBeInTheDocument();
    expect(shuffleButtonElem).toHaveAttribute(
      "data-tooltip",
      expect.stringMatching(/shuffle/i)
    );

    const shuffleIconElem = shuffleButtonElem.firstChild;
    expect(shuffleIconElem).toBeInTheDocument();
    expect(shuffleIconElem).toHaveClass("MuiSvgIcon-root");
  });

  test("should render clear button with icons correctly", () => {
    const { container } = renderPlayingPanelBtnGroup();

    const clearButtonElem = container.querySelectorAll("button")[2];
    expect(clearButtonElem).toBeInTheDocument();
    expect(clearButtonElem).toHaveAttribute(
      "data-tooltip",
      expect.stringMatching(/clear/i)
    );

    const clearIconElem = clearButtonElem.firstChild;
    expect(clearIconElem).toBeInTheDocument();
    expect(clearIconElem).toHaveClass("MuiSvgIcon-root");
  });
});

describe("testing PlayingPanelBtnGroup buttons clicks", () => {
  const playlistId = "playlistId-1";
  const playlistItemId = "itemId-1-1";
  const playlistSnippetId = "snippetId-1-1";
  let initialState: DeepPartial<AppState>;
  let storeWithListToPlay: ReturnType<typeof generateMockStore>;

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

    storeWithListToPlay = generateMockStore(initialState);
  });

  test("should handle play button clicks correctly", () => {
    const { container } = renderPlayingPanelBtnGroup(storeWithListToPlay);

    const playButtonElem = container.querySelectorAll("button")[0];
    expect(playButtonElem).toBeInTheDocument();
    expect(playButtonElem).toHaveAttribute(
      "data-tooltip",
      expect.stringMatching(/play/i)
    );

    fireEvent.click(playButtonElem);

    // the user is redirected to player page
    // if the history array contains /player/ytplayer route
    expect(mockHistory.length).not.toBe(0);
    expect(mockHistory).toEqual(expect.arrayContaining(["/player/ytplayer"]));
  });

  test("should handle shuffle button clicks correctly", () => {
    const { container } = renderPlayingPanelBtnGroup();

    const shuffleButtonElem = container.querySelectorAll("button")[1];
    expect(shuffleButtonElem).toBeInTheDocument();

    // ensure no error being thrown
    fireEvent.click(shuffleButtonElem);
  });

  test("should handle clear button clicks", async () => {
    const { container, getByText } = renderPlayingPanelBtnGroup(
      storeWithListToPlay
    );

    const clearButtonElem = container.querySelectorAll("button")[2];
    expect(clearButtonElem).toBeInTheDocument();

    // before click asserts listToPlay has contents
    const prevListToPlayResult = selectListToPlayResult(
      storeWithListToPlay.getState() as AppState
    );
    expect(prevListToPlayResult.length).not.toBe(0);

    // clicks clear button
    fireEvent.click(clearButtonElem);

    // get sweetalert2 clear button
    const confirmButtonElem = await waitForElement(
      () => getByText("Yes, clear it please!🔥"),
      {
        container,
      }
    );
    expect(confirmButtonElem).toBeInTheDocument();
    expect(confirmButtonElem).toHaveClass("swal2-confirm");

    // clicks and wait the promise to resolve
    await wait(() => fireEvent.click(confirmButtonElem));

    // assert next listToPlay entities and result to be empty
    const nextListToPlayPlaylistItems = selectListToPlayPlaylistItems(
      storeWithListToPlay.getState() as AppState
    );
    const nextListToPlayResult = selectListToPlayResult(
      storeWithListToPlay.getState() as AppState
    );
    expect(nextListToPlayPlaylistItems).toEqual({});
    expect(nextListToPlayResult.length).toBe(0);
  });
});
