import { SET_PREFER_DARK_THEME } from "../../utils/constants/actionConstants";

/** @type {UserPreferencesState} */
const initialStates = {
  preferDarkTheme: true,
};

/**
 * userPreferences reducer
 *
 * @param {UserPreferencesState} [state=initialStates]
 * @param {UserPreferencesActions} action
 * @returns
 */
export const userPreferences = (state = initialStates, action) => {
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
