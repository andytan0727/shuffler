import { ActionType } from "typesafe-actions";

import * as userPreferencesAction from "./action";

export interface UserPreferencesState {
  preferDarkTheme: boolean;
}

export type UserPreferencesAction = ActionType<typeof userPreferencesAction>;
