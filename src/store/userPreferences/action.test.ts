import { SET_PREFER_DARK_THEME } from "../../utils/constants/actionConstants";
import { setPreferDarkTheme } from "./action";

describe("userPreferences actions", () => {
  test("should create SET_PREFER_DARK_THEME action object", () => {
    const isPreferDarkTheme = true;

    expect(setPreferDarkTheme(isPreferDarkTheme)).toEqual({
      type: SET_PREFER_DARK_THEME,
      payload: {
        isPreferDarkTheme: true,
      },
    });
  });
});
