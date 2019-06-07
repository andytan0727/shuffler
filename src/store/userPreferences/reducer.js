import { SET_PREFER_DARK_THEME } from "../../utils/constants/actionConstants";

const initialStates = {
  preferDarkTheme: true,
};

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
