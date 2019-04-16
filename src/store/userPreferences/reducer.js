import { SET_PREFER_DARK_THEME } from "../../utils/constants/actionConstants";
import { dbPreferences } from "../../utils/helper/dbHelper";

const initialStates = {
  preferDarkTheme: true,
};

export const userPreferences = (state = initialStates, action) => {
  switch (action.type) {
    case SET_PREFER_DARK_THEME: {
      const isPreferDarkTheme = action.payload.isPreferDarkTheme;

      // persist to indexedDB
      if (action.payload.persist) {
        dbPreferences
          .setItem("darkTheme", isPreferDarkTheme)
          .then(() => console.log("successfully saved preferred theme"));
      }

      return {
        ...state,
        preferDarkTheme: isPreferDarkTheme,
      };
    }

    default: {
      return state;
    }
  }
};
