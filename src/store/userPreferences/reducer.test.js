import deepFreeze from "deep-freeze";
import { setPreferDarkTheme } from "./action";
import { userPreferences as userPreferencesReducer } from "./reducer";

describe("userPreferences reducer", () => {
  const initialState = {
    preferDarkTheme: true,
  };

  deepFreeze(initialState);

  test("should return initial state on default", () => {
    expect(userPreferencesReducer(undefined, {})).toEqual(initialState);
  });

  test("should handle SET_PERFER_DARK_THEME", () => {
    const preferDarkTheme = setPreferDarkTheme(true);

    const preferLightTheme = setPreferDarkTheme(false);

    expect(userPreferencesReducer(undefined, preferDarkTheme)).toEqual({
      ...initialState,
      preferDarkTheme: true,
    });

    expect(userPreferencesReducer(undefined, preferLightTheme)).toEqual({
      ...initialState,
      preferDarkTheme: false,
    });
  });
});
