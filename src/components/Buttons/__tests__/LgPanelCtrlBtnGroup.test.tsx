import partial from "lodash/partial";
import React from "react";
import { AppState } from "store";
import { selectFilteredSnippets } from "store/ytplaylist/filteredSelectors";
import { DeepPartial } from "utility-types";
import { generateMockStore, renderWithRedux } from "utils/helper/mockStore";
import { makeListToPlaySnippets } from "utils/helper/testUtils";

import { fireEvent } from "@testing-library/react";

import {
  default as LgPanelCtrlBtnGroup,
  LgPanelCtrlBtnGroupWithRename,
} from "../LgPanelCtrlBtnGroup/LgPanelCtrlBtnGroup";

describe("testing LgPanelCtrlBtnGroup UI renders", () => {
  const renderLgPanelCtrlBtnGroup = partial(
    renderWithRedux,
    <LgPanelCtrlBtnGroup
      // event handler functions are not concerned in this test
      handlePlay={jest.fn()}
      handleShuffle={jest.fn()}
      handleDelete={jest.fn()}
    />
  );

  test("should render play icon button correctly", () => {
    const { getByTitle } = renderLgPanelCtrlBtnGroup();

    const playButtonElem = getByTitle(/play/i);
    expect(playButtonElem).toBeInTheDocument();
    expect(playButtonElem).toHaveAttribute("type", "button");

    const playIconElem = playButtonElem!.firstChild;
    expect(playIconElem).toBeInTheDocument();
    expect(playIconElem).toHaveClass("MuiIconButton-label");
  });

  test("should render shuffle button when no filter applied", () => {
    const { getByTitle } = renderLgPanelCtrlBtnGroup();

    // check existence of shuffle icon button
    const shuffleButtonElem = getByTitle(/shuffle/i);
    expect(shuffleButtonElem).toBeInTheDocument();
    expect(shuffleButtonElem).toHaveAttribute("type", "button");

    // check existence of shuffle icon
    const shuffleIconElem = shuffleButtonElem!.firstChild;

    expect(shuffleIconElem).toBeInTheDocument();
    expect(shuffleIconElem).toHaveClass("MuiIconButton-label");
  });

  test("should render disabled shuffle button when filter applied", () => {
    const initialStates: DeepPartial<AppState> = {
      ytplaylist: {
        filtered: {
          snippets: makeListToPlaySnippets(),
        },
      },
    };

    const storeWithFiltered = generateMockStore(initialStates);

    const { container } = renderLgPanelCtrlBtnGroup(storeWithFiltered);

    // assert filterSnippets array exists and not empty
    const filteredSnippets = selectFilteredSnippets(
      storeWithFiltered.getState() as AppState
    );
    expect(filteredSnippets).toBeDefined();
    expect(filteredSnippets!.length).not.toBe(0);

    // assert disabled shuffle button
    const shuffleButtonElem = container.querySelectorAll("button")[1];
    expect(shuffleButtonElem).toBeInTheDocument();
    expect(shuffleButtonElem).toHaveAttribute("type", "button");
    expect(shuffleButtonElem).toBeDisabled();
  });

  test("should render delete icon button correctly", () => {
    const { getByTitle } = renderLgPanelCtrlBtnGroup();

    const deleteButtonElem = getByTitle(/delete/i);
    expect(deleteButtonElem).toBeInTheDocument();
    expect(deleteButtonElem).toHaveAttribute("type", "button");

    const deleteIconElem = deleteButtonElem!.firstChild;
    expect(deleteIconElem).toBeInTheDocument();
    expect(deleteIconElem).toHaveClass("MuiIconButton-label");
  });
});

describe("testing LgPanelCtrlBtnGroupWithRename UI renders", () => {
  const renderLgPanelCtrlBtnGroupWithRename = partial(
    renderWithRedux,
    <LgPanelCtrlBtnGroupWithRename
      // event handler functions are not concerned in this test
      handlePlay={jest.fn()}
      handleShuffle={jest.fn()}
      handleDelete={jest.fn()}
      handleRename={jest.fn()}
    />
  );

  test("should render rename button correctly", () => {
    const { getByTitle } = renderLgPanelCtrlBtnGroupWithRename();

    const renameButtonElem = getByTitle(/rename/i);
    expect(renameButtonElem).toBeInTheDocument();
    expect(renameButtonElem).toHaveAttribute("type", "button");

    const renameIconElem = renameButtonElem!.firstChild;
    expect(renameIconElem).toBeInTheDocument();
    expect(renameIconElem).toHaveClass("MuiIconButton-label");
  });
});

describe("testing LgPanelCtrlBtnGroup clicks", () => {
  const mockHandlePlay = jest.fn();
  const mockHandleShuffle = jest.fn();
  const mockHandleDelete = jest.fn();
  const renderLgPanelCtrlBtnGroup = partial(
    renderWithRedux,
    <LgPanelCtrlBtnGroup
      handlePlay={mockHandlePlay}
      handleShuffle={mockHandleShuffle}
      handleDelete={mockHandleDelete}
    />
  );

  test("should handle play button clicks", () => {
    const { getByTitle } = renderLgPanelCtrlBtnGroup();

    const playButtonElem = getByTitle(/play/i);
    expect(playButtonElem).toBeInTheDocument();

    // simulate click play button
    fireEvent.click(playButtonElem);

    // play function is called, but the other two shouldn't be
    expect(mockHandlePlay).toHaveBeenCalledTimes(1);
    expect(mockHandleShuffle).toHaveBeenCalledTimes(0);
    expect(mockHandleDelete).toHaveBeenCalledTimes(0);
  });

  test("should handle shuffle button clicks when no filter applied", () => {
    const { getByTitle } = renderLgPanelCtrlBtnGroup();

    const shuffleButtonElem = getByTitle(/shuffle/i);
    expect(shuffleButtonElem).toHaveAttribute("type", "button");

    // simulate click shuffle button
    fireEvent.click(shuffleButtonElem);

    // play and shuffle function should be called
    expect(mockHandlePlay).toHaveBeenCalledTimes(1); // called previously
    expect(mockHandleShuffle).toHaveBeenCalledTimes(1);
    expect(mockHandleDelete).toHaveBeenCalledTimes(0);
  });

  test("should handle delete button clicks", () => {
    const { getByTitle } = renderLgPanelCtrlBtnGroup();

    const deleteButtonElem = getByTitle(/delete/i);
    expect(deleteButtonElem).toBeInTheDocument();

    // test delete handler function
    fireEvent.click(deleteButtonElem);

    // all three event handler functions should be called at most one time
    expect(mockHandlePlay).toHaveBeenCalledTimes(1);
    expect(mockHandleShuffle).toHaveBeenCalledTimes(1);
    expect(mockHandleDelete).toHaveBeenCalledTimes(1);
  });
});

describe("testing LgPanelCtrlBtnGroupWithRename clicks", () => {
  const mockHandlePlay = jest.fn();
  const mockHandleShuffle = jest.fn();
  const mockHandleDelete = jest.fn();
  const mockHandleRename = jest.fn();
  const renderLgPanelCtrlBtnGroupWithRename = partial(
    renderWithRedux,
    <LgPanelCtrlBtnGroupWithRename
      handlePlay={mockHandlePlay}
      handleShuffle={mockHandleShuffle}
      handleDelete={mockHandleDelete}
      handleRename={mockHandleRename}
    />
  );

  test("should handle rename button click", () => {
    const { getByTitle } = renderLgPanelCtrlBtnGroupWithRename();

    const renameButtonElem = getByTitle(/rename/i);
    expect(renameButtonElem).toBeInTheDocument();

    // test delete handler function
    fireEvent.click(renameButtonElem);

    // assert only rename function clicked
    expect(mockHandlePlay).toHaveBeenCalledTimes(0);
    expect(mockHandleShuffle).toHaveBeenCalledTimes(0);
    expect(mockHandleDelete).toHaveBeenCalledTimes(0);
    expect(mockHandleRename).toHaveBeenCalledTimes(1);
  });
});
