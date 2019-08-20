import partial from "lodash/partial";
import React from "react";
import { AppState } from "store";
import { setCurSongIdx } from "store/ytplayer/action";
import {
  selectCurSongIdx,
  selectPlaying,
  selectRepeat,
} from "store/ytplayer/selector";
import { DeepPartial } from "utility-types";
import { generateMockStore, renderWithRedux } from "utils/helper/mockStore";

import { fireEvent } from "@testing-library/react";

import PlayerBasicCtrlBtnGroup from "../PlayerBasicCtrlBtnGroup";

// NOTE: this is a component that renders with the
// minimal redux store setup. This means that
// component that  renders with this partial function
// should not dispatch any actions
// To get component with dispatch-enabled actions,
// please supply a custom store
const renderPlayerBasicCtrlBtnGroup = partial(
  renderWithRedux,
  <PlayerBasicCtrlBtnGroup ytPlayerRef={React.createRef()} />
);

describe("testing PlayerBasicCtrlBtnGroup UI renders", () => {
  test("should render loop button correctly", () => {
    const { container } = renderPlayerBasicCtrlBtnGroup();

    const loopButtonElem = container.querySelectorAll("button")[0];
    expect(loopButtonElem).toBeInTheDocument();
    expect(loopButtonElem).toHaveAttribute("aria-label", "Loop");

    const loopIconElem = loopButtonElem!.firstChild;
    expect(loopIconElem).toBeInTheDocument();
    expect(loopIconElem).toHaveClass("MuiIconButton-label");
  });

  test("should render previous button correctly", () => {
    const { container } = renderPlayerBasicCtrlBtnGroup();

    const previousButtonElem = container.querySelectorAll("button")[1];
    expect(previousButtonElem).toBeInTheDocument();
    expect(previousButtonElem).toHaveAttribute("aria-label", "Previous");

    const previousIconElem = previousButtonElem!.firstChild;
    expect(previousIconElem).toBeInTheDocument();
    expect(previousIconElem).toHaveClass("MuiIconButton-label");
  });

  test("should render disabled previous button correctly when curSongIdx === 0", () => {
    const storeWithPlayer = generateMockStore({
      ytplayer: {
        curSongIdx: 0,
      },
    });
    const { container } = renderPlayerBasicCtrlBtnGroup(storeWithPlayer);

    // assert initial curSongIdx to be 0
    expect(selectCurSongIdx(storeWithPlayer.getState() as AppState)).toBe(0);

    const previousButtonElem = container.querySelectorAll("button")[1];
    expect(previousButtonElem).toBeInTheDocument();
    expect(previousButtonElem).toHaveAttribute("aria-label", "Previous");
    expect(previousButtonElem).toBeDisabled();
  });

  test("should render play button correctly when no song is currently playing", () => {
    const initialState: DeepPartial<AppState> = {
      ytplayer: {
        playing: false,
      },
    };
    const storeWithPlaying = generateMockStore(initialState);

    const { container } = renderPlayerBasicCtrlBtnGroup(storeWithPlaying);

    // making sure playing is false
    expect(selectPlaying(storeWithPlaying.getState() as AppState)).toBeFalsy();

    const playButtonElem = container.querySelectorAll("button")[2];
    expect(playButtonElem).toBeInTheDocument();
    expect(playButtonElem).toHaveAttribute("aria-label", "Play");

    const playArrowIconElem = playButtonElem!.firstChild;
    expect(playArrowIconElem).toBeInTheDocument();
    expect(playArrowIconElem).toHaveClass("MuiIconButton-label");
  });

  test("should render pause button when song is currently playing", () => {
    const initialState: DeepPartial<AppState> = {
      ytplayer: {
        playing: true,
      },
    };
    const storeWithPlaying = generateMockStore(initialState);

    const { container } = renderPlayerBasicCtrlBtnGroup(storeWithPlaying);

    // making sure playing is true
    expect(selectPlaying(storeWithPlaying.getState() as AppState)).toBeTruthy();

    const pauseButtonElem = container.querySelectorAll("button")[2];
    expect(pauseButtonElem).toBeInTheDocument();
    expect(pauseButtonElem).toHaveAttribute("aria-label", "Pause");

    const pauseIconElem = pauseButtonElem!.firstChild;
    expect(pauseIconElem).toBeInTheDocument();
    expect(pauseIconElem).toHaveClass("MuiIconButton-label");
  });

  test("should render next button correctly", () => {
    const { container } = renderPlayerBasicCtrlBtnGroup();

    const nextButtonElem = container.querySelectorAll("button")[3];
    expect(nextButtonElem).toBeInTheDocument();
    expect(nextButtonElem).toHaveAttribute("aria-label", "Next");

    const skipNextIconElem = nextButtonElem!.firstChild;
    expect(skipNextIconElem).toBeInTheDocument();
    expect(skipNextIconElem).toHaveClass("MuiIconButton-label");
  });

  test("should render shuffle button correctly", () => {
    const { container } = renderPlayerBasicCtrlBtnGroup();

    const shuffleButtonElem = container.querySelectorAll("button")[4];
    expect(shuffleButtonElem).toBeInTheDocument();
    expect(shuffleButtonElem).toHaveAttribute("aria-label", "Shuffle");

    const shuffleIconElem = shuffleButtonElem!.firstChild;
    expect(shuffleIconElem).toBeInTheDocument();
    expect(shuffleIconElem).toHaveClass("MuiIconButton-label");
  });
});

describe("testing PlayerBasicCtrlBtnGroup buttons clicks", () => {
  let initialState: DeepPartial<AppState>;
  let storeWithPlayer: ReturnType<typeof generateMockStore>;

  beforeEach(() => {
    initialState = {
      ytplayer: {
        repeat: false,
        curSongIdx: 0,
        playing: false,
      },
    };
    storeWithPlayer = generateMockStore(initialState);
  });

  test("should loop button toggle loop correctly", () => {
    const { container } = renderPlayerBasicCtrlBtnGroup(storeWithPlayer);

    const loopButtonElem = container.querySelectorAll("button")[0];
    expect(loopButtonElem).toBeInTheDocument();

    // assert initial repeat to be false
    expect(selectRepeat(storeWithPlayer.getState() as AppState)).toBeFalsy();

    // click to dispatch TOGGLE_REPEAT action
    fireEvent.click(loopButtonElem);

    // assert repeat to be true now after toggling
    // if success
    expect(selectRepeat(storeWithPlayer.getState() as AppState)).toBe(true);
  });

  test("should handle previous button clicks", () => {
    const { container } = renderPlayerBasicCtrlBtnGroup(storeWithPlayer);

    // dispatch action to make sure curSongIdx now is 1
    storeWithPlayer.dispatch(setCurSongIdx(1));
    const prevCurSongIdx = selectCurSongIdx(
      storeWithPlayer.getState() as AppState
    );
    expect(prevCurSongIdx).toBe(1);

    const previousButtonElem = container.querySelectorAll("button")[1];
    expect(previousButtonElem).toBeInTheDocument();

    // fire click event to dispatch SET_CURRENT_SONG_IDX action
    // and assert next curSongIdx to be less one
    // from prevCurSongIdx, which is 0
    fireEvent.click(previousButtonElem);
    const nextCurSongIdx = selectCurSongIdx(
      storeWithPlayer.getState() as AppState
    );
    expect(nextCurSongIdx).toBe(prevCurSongIdx - 1);
  });

  /**
   * Play and pause function is out of this app control,
   * which they include calling YouTube Iframe internal
   * function playVideo/pauseVideo.
   * Therefore, both of the buttons will be skipped for unit testing
   * and will be tested manually by human
   */

  test("should handle next button clicks correctly", () => {
    const { container } = renderPlayerBasicCtrlBtnGroup(storeWithPlayer);

    const prevCurSongIdx = selectCurSongIdx(
      storeWithPlayer.getState() as AppState
    );
    expect(prevCurSongIdx).toBe(0);

    const nextButtonElem = container.querySelectorAll("button")[3];
    expect(nextButtonElem).toBeInTheDocument();

    // click to dispatch SET_CURRENT_SONG_IDX action
    // with prevCurSongIdx + 1
    fireEvent.click(nextButtonElem);

    const nextCurSongIdx = selectCurSongIdx(
      storeWithPlayer.getState() as AppState
    );
    expect(nextCurSongIdx).toBe(prevCurSongIdx + 1);
  });

  test("should handle shuffle button clicks", () => {
    const { container } = renderPlayerBasicCtrlBtnGroup(storeWithPlayer);

    // set curSongIdx to a higher number
    // to test whether curSongIdx is reset to 0 after shuffling
    storeWithPlayer.dispatch(setCurSongIdx(100));
    expect(selectCurSongIdx(storeWithPlayer.getState() as AppState)).toBe(100);

    const shuffleButtonElem = container.querySelectorAll("button")[4];
    expect(shuffleButtonElem).toBeInTheDocument();

    fireEvent.click(shuffleButtonElem);

    // assert curSongIdx to be reset back to 0 after shuffling
    // Note: we ignored shuffled listToPlay
    expect(selectCurSongIdx(storeWithPlayer.getState() as AppState)).toBe(0);
  });
});
