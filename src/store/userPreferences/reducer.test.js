import { setPreferDarkTheme } from "./action";
import { userPreferences as userPreferencesReducer } from "./reducer";

describe("userPreferences reducer", () => {
  test("should return initial state on default", () => {
    expect(userPreferencesReducer(undefined, {})).toEqual({
      preferDarkTheme: true,
    });
  });

  test("should handle SET_PERFER_DARK_THEME", () => {
    const preferDarkTheme = setPreferDarkTheme(true);

    const preferLightTheme = setPreferDarkTheme(false);

    expect(userPreferencesReducer(undefined, preferDarkTheme)).toEqual({
      preferDarkTheme: true,
    });

    expect(userPreferencesReducer(undefined, preferLightTheme)).toEqual({
      preferDarkTheme: false,
    });
  });
});
