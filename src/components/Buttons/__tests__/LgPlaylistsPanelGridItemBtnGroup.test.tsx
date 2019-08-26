import partial from "lodash/partial";
import React from "react";
import { AppState } from "store";
import {
  selectListToPlayEntities,
  selectListToPlayResult,
} from "store/ytplaylist/listToPlaySelectors";
import {
  addAllInPlayingLabelByIdAction,
  removeAllInPlayingLabelByIdAction,
} from "store/ytplaylist/playlistActions";
import {
  selectPlaylistAllInPlayingById,
  selectPlaylistsResult,
} from "store/ytplaylist/playlistSelectors";
import { ListToPlayEntities } from "store/ytplaylist/types";
import { DeepPartial } from "utility-types";
import { generateMockStore, renderWithRedux } from "utils/helper/mockStore";

import { fireEvent } from "@testing-library/react";

import LgPlaylistsPanelGridItemBtn from "../BtnGroup/LgPlaylistsPanelGridItemBtnGroup";

const playlistId = "playlistId-1";
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
const renderLgPlaylistsPanelGridItemBtn = partial(
  renderWithRedux,
  <LgPlaylistsPanelGridItemBtn playlistId={playlistId} />
);

describe("testing LgPlaylistsPanelGridItemBtn component", () => {
  let initialState: DeepPartial<AppState>;
  let storeWithPlaylists: ReturnType<typeof generateMockStore>;

  beforeEach(() => {
    initialState = {
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

    storeWithPlaylists = generateMockStore(initialState);
  });

  test("should render without crashing", () => {
    const { container } = renderLgPlaylistsPanelGridItemBtn();

    expect(container.firstChild).toBeInTheDocument();
  });

  test("should render play button and handle play function correctly", () => {
    const { getByTitle } = renderLgPlaylistsPanelGridItemBtn();

    // play button
    const playButtonElem = getByTitle(/play$/i);
    expect(playButtonElem).toBeInTheDocument();
    expect(playButtonElem).toHaveAttribute("type", "button");

    // play icon
    const playIconElem = playButtonElem!.firstChild;
    expect(playIconElem).toBeInTheDocument();
    expect(playIconElem).toHaveClass("MuiIconButton-label");
  });

  test("should render shuffle button correctly", () => {
    const { getByTitle } = renderLgPlaylistsPanelGridItemBtn();

    const shuffleButtonElem = getByTitle(/shuffle/i);
    expect(shuffleButtonElem).toBeInTheDocument();
    expect(shuffleButtonElem).toHaveAttribute("type", "button");

    const shuffleIcon = shuffleButtonElem!.firstChild;
    expect(shuffleIcon).toBeInTheDocument();
    expect(shuffleIcon).toHaveClass("MuiIconButton-label");
  });

  test("should render RemovePlaylistFromPlayingBtn when playlistInPlaying is true", () => {
    const {
      getByTitle,
      rerender,
      ReduxStoreWrappedComponent,
    } = renderLgPlaylistsPanelGridItemBtn(storeWithPlaylists);

    // dispatch action to add allInPlaying label to
    // ensure allInPlaying is true
    storeWithPlaylists.dispatch(addAllInPlayingLabelByIdAction(playlistId));

    const playlistInPlaying = selectPlaylistAllInPlayingById(
      storeWithPlaylists.getState() as AppState,
      playlistId
    );
    expect(playlistInPlaying).toBeTruthy();

    // rerender to ensure component gets the latest states
    rerender(ReduxStoreWrappedComponent);

    const removePlaylistButtonElem = getByTitle(/remove playlist/i);
    expect(removePlaylistButtonElem).toBeInTheDocument();
    expect(removePlaylistButtonElem).toHaveAttribute("type", "button");
  });

  test("should render AddPlaylistFromPlayingBtn when playlistInPlaying is false", () => {
    const {
      getByTitle,
      rerender,
      ReduxStoreWrappedComponent,
    } = renderLgPlaylistsPanelGridItemBtn(storeWithPlaylists);

    // dispatch action to remove any previously set allInPlaying label
    storeWithPlaylists.dispatch(removeAllInPlayingLabelByIdAction(playlistId));

    const playlistInPlaying = selectPlaylistAllInPlayingById(
      storeWithPlaylists.getState() as AppState,
      playlistId
    );
    expect(playlistInPlaying).toBeFalsy();

    rerender(ReduxStoreWrappedComponent);

    const addPlaylistButtonElem = getByTitle(/add playlist/i);
    expect(addPlaylistButtonElem).toBeInTheDocument();
    expect(addPlaylistButtonElem).toHaveAttribute("type", "button");
  });

  test("should render delete button correctly", () => {
    const { getByTitle } = renderLgPlaylistsPanelGridItemBtn(
      storeWithPlaylists
    );

    const deleteButtonElem = getByTitle(/delete/i);
    expect(deleteButtonElem).toBeInTheDocument();
    expect(deleteButtonElem).toHaveAttribute("type", "button");
  });
});

describe("testing LgPlaylistsPanelGridItemBtn clicks", () => {
  let initialState: DeepPartial<AppState>;
  let storeWithPlaylists: ReturnType<typeof generateMockStore>;

  beforeEach(() => {
    initialState = {
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

    storeWithPlaylists = generateMockStore(initialState);
  });

  test("should handle play button clicks correctly", () => {
    const { getByTitle } = renderLgPlaylistsPanelGridItemBtn(
      storeWithPlaylists
    );

    const playButtonElem = getByTitle(/play$/i);
    expect(playButtonElem).toBeInTheDocument();

    // play icon
    const playIconElem = playButtonElem!.firstChild;
    expect(playIconElem).toBeInTheDocument();
    expect(playIconElem).toHaveClass("MuiIconButton-label");

    let appState = storeWithPlaylists.getState() as AppState;
    let listToPlayEntities: ListToPlayEntities = selectListToPlayEntities(
      appState
    );
    let listToPlayResult = selectListToPlayResult(appState);

    // subscribe to store to listen for UPDATE_LIST_TO_PLAY action dispatched
    const unsubscribe = storeWithPlaylists.subscribe(() => {
      appState = storeWithPlaylists.getState() as AppState;

      listToPlayEntities = selectListToPlayEntities(appState);
      listToPlayResult = selectListToPlayResult(appState);
    });

    // expect listToPlay entities and result is empty before action is dispatched
    expect(Object.keys(listToPlayEntities.playlistItems).length).toBe(0);
    expect(listToPlayResult.length).toBe(0);

    // fire play button's click event
    // this dispatches UPDATE_LIST_TO_PLAY action
    fireEvent.click(playButtonElem);

    // expect listToPlay is populated with items after
    // UPDATE_LIST_TO_PLAY action is dispatched
    expect(Object.keys(listToPlayEntities.playlistItems).length).not.toBe(0);
    expect(listToPlayResult.length).not.toBe(0);

    // route pushed to mockedHistory array
    expect(mockHistory[0]).toBe("/player/ytplayer");

    // unsubscribe to store after test finished
    unsubscribe();
  });

  test("should handle delete button clicks correctly", () => {
    const { getByTitle, unmount } = renderLgPlaylistsPanelGridItemBtn(
      storeWithPlaylists
    );

    const deleteButtonElem = getByTitle(/delete/i);
    expect(deleteButtonElem).toBeInTheDocument();

    const prevPlaylistCount = selectPlaylistsResult(
      storeWithPlaylists.getState() as AppState
    ).length;

    // fire click event to delete playlist
    // the component is unmounted after playlist is deleted
    fireEvent.click(deleteButtonElem);
    unmount();

    // deleted one playlist
    expect(
      selectPlaylistsResult(storeWithPlaylists.getState() as AppState).length
    ).toBe(prevPlaylistCount - 1);
  });
});
