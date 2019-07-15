import * as userPreferencesAction from "./action";
import { ActionType } from "typesafe-actions";

export interface UserPreferencesState {
  preferDarkTheme: boolean;
}

export type UserPreferencesAction = ActionType<typeof userPreferencesAction>;
