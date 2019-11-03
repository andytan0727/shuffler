import { notify } from "utils/helper/notifyHelper";

export const notifyEmptyPlaylistList = () =>
  notify("warning", "Your playing list is empty!");
