/* eslint-disable react/display-name */
import React from "react";
import { DropResult } from "react-beautiful-dnd";
import { Provider } from "react-redux";
import { Store } from "redux";

import { renderHook, RenderHookResult } from "@testing-library/react-hooks";

export const getDropResult = (fromIdx: number, toIdx: number): DropResult => ({
  type: "type",
  draggableId: "draggable",
  mode: "FLUID",
  reason: "DROP",
  source: {
    droppableId: "droppableId-1",
    index: fromIdx,
  },
  destination: {
    droppableId: "droppableId-1",
    index: toIdx,
  },
});

export const renderHookWithReduxStore = <P, R>(
  hookFunc: (props: P) => R,
  store: Store
): RenderHookResult<P, R> =>
  renderHook(
    hookFunc,

    { wrapper: (props: any) => <Provider {...props} store={store} /> }
  );
