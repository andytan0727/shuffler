import { Reducer } from "typesafe-actions";
import { SET_PREFER_DARK_THEME } from "utils/constants/actionConstants";

import { UserPreferencesAction, UserPreferencesState } from "./types";

const initialStates: UserPreferencesState = {
  preferDarkTheme: true,
};

export const userPreferences: Reducer<
  UserPreferencesState,
  UserPreferencesAction
> = (state = initialStates, action) => {
  switch (action.type) {
    case SET_PREFER_DARK_THEME: {
      return {
        ...state,
        preferDarkTheme: action.payload.isPreferDarkTheme,
      };
    }

    default: {
      return state;
    }
  }
};
