import React from "react";
import { renderWithRedux } from "utils/helper/mockStore";

import SwitchPanelRadioBtn from "../BtnGroup/SwitchPanelRadioBtnGroup";

const mockHandleChangePanel = jest.fn();

describe("testing SwitchPanelRadioBtn UI renders", () => {
  test("should render checked playlist radio button correctly", () => {
    const { container } = renderWithRedux(
      <SwitchPanelRadioBtn
        checkedButton={"radio-videolist"}
        handleChangePanel={mockHandleChangePanel}
      />
    );

    const playlistRadioBtnElem = container.querySelector("#playlistRadio");
    expect(playlistRadioBtnElem).toBeInTheDocument();
    expect(playlistRadioBtnElem).toHaveAttribute("type", "radio");
    expect((playlistRadioBtnElem as HTMLInputElement).checked).toBe(true);
  });

  test("should render checked video radio button correctly", () => {
    const { container } = renderWithRedux(
      <SwitchPanelRadioBtn
        checkedButton={"radio-video"}
        handleChangePanel={mockHandleChangePanel}
      />
    );

    const videoRadioBtnElem = container.querySelector("#videoRadio");
    expect(videoRadioBtnElem).toBeInTheDocument();
    expect(videoRadioBtnElem).toHaveAttribute("type", "radio");
    expect((videoRadioBtnElem as HTMLInputElement).checked).toBe(true);
  });

  test("should render checked playing radio button correctly", () => {
    const { container } = renderWithRedux(
      <SwitchPanelRadioBtn
        checkedButton={"radio-playing"}
        handleChangePanel={mockHandleChangePanel}
      />
    );

    const playingRadioBtnElem = container.querySelector("#playingRadio");
    expect(playingRadioBtnElem).toBeInTheDocument();
    expect(playingRadioBtnElem).toHaveAttribute("type", "radio");
    expect((playingRadioBtnElem as HTMLInputElement).checked).toBe(true);
  });
});
