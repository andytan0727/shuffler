import React from "react";

import { fireEvent, render } from "@testing-library/react";

import DeleteItemButton from "../DeleteButtons/DeleteItemButton";

describe("testing DeleteItemButton UI renders", () => {
  test("should render button with delete icon correctly", () => {
    const mockHandleOnClick = jest.fn();
    const { container } = render(
      <DeleteItemButton handleOnClick={mockHandleOnClick} />
    );

    // first child should be button
    const iconButtonElem = container.firstChild;

    expect(iconButtonElem).toBeInTheDocument();
    expect(iconButtonElem).toHaveAttribute("aria-label", "delete-video");
    expect(iconButtonElem).toHaveAttribute("type", "button");

    // icon button should have delete icon
    const deleteIconElem = iconButtonElem!.firstChild;

    expect(deleteIconElem).toBeInTheDocument();
    expect(deleteIconElem).toHaveClass("MuiIconButton-label");

    // check whether onClick handler is called properly
    fireEvent.click(iconButtonElem as HTMLButtonElement);

    expect(mockHandleOnClick).toHaveBeenCalledTimes(1);
  });
});

describe("testing DeleteItemButton clicks", () => {
  test("should handle delete correctly", () => {
    const mockHandleOnClick = jest.fn();
    const { container } = render(
      <DeleteItemButton handleOnClick={mockHandleOnClick} />
    );

    // first child should be button
    const iconButtonElem = container.firstChild;
    expect(iconButtonElem).toBeInTheDocument();

    // check whether onClick handler is called properly
    fireEvent.click(iconButtonElem as HTMLButtonElement);

    expect(mockHandleOnClick).toHaveBeenCalledTimes(1);
  });
});
