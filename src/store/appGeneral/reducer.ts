import { AnyAction } from "redux";

const initialStates = {
  appUpdates: [
    {
      version: "1.0.0",
      changes: [
        "Trigger dark theme with global shortcut Ctrl + Alt + D",
        "Added shuffle function in Player page",
        "Trigger shuffle in Player with shortcut Ctrl + Alt + S",
        "Fix transition issue from dark theme to light theme",
      ],
    },
    {
      version: "1.0.1",
      changes: ["Fix shortcut bugs after pressed iframe and buttons"],
    },
    {
      version: "1.0.2",
      changes: [
        "Fix the problem of proceeding to player page with an empty playing list",
      ],
    },
    {
      version: "1.0.3",
      changes: [
        "Fix broken UI when video not found in player page",
        "Update navbar links' style on active page",
      ],
    },
    {
      version: "2.0.0",
      changes: [
        "Change main page appearance",
        "Improve playlist input page UI",
        "Add new mini player as an alternative to the existing YT player",
        "All non-valid URL path on / will be redirected to main page instead, and all non-valid path on /player will be directed to /player/ytplayer",
      ],
    },
    {
      version: "2.1.0",
      changes: [
        "Change playlistInput page designs",
        "Individual video searching is now supported",
        "Added functionality to remove particular playlist(s) from playing in playlistInput page",
        "Added functionality to rename playlists/videos",
        "Dark theme is set as the default mode",
      ],
    },
    {
      version: "2.1.1",
      changes: ["Fix: Problem of repeating one song in playlist"],
    },
    {
      version: "2.1.2",
      changes: [
        "Change default panel shown on first visit to PlaylistInputPage as PlayingPanel",
      ],
    },
    {
      version: "2.2.0",
      changes: [
        "Renew layout for video panel",
        "Added function to remove video from playing list",
        "Fix: broken playlistInputPage UI color on light mode",
      ],
    },
    {
      version: "2.3.0",
      changes: ["New layout in YT Player page"],
    },
    {
      version: "2.3.1",
      changes: [
        "Fix: hidden video title in YT Player",
        "Fix: scaling problem of panels in smaller screen",
      ],
    },
    {
      version: "2.4.0",
      changes: [
        "Fix: error when simultaneously checked videos and playlists",
        "Shuffler now shuffles playlist after the playing list ends with loop enabled",
      ],
    },
    {
      version: "2.4.1",
      changes: ["Fix: several vulnerabilities"],
    },
    {
      version: "3.0.0",
      changes: [
        "Shuffler now using local storage instead of indexedDB to store user data. Hence your previously saved videos and playlists will be LOST, but recoverable",
        "Fix most broken layout colors in light mode",
        "Fix transition problem in light mode",
        "Update What's New page style, i.e. the page you are seeing now :)",
        "Dark/Light mode switch is now updated to new style !",
      ],
    },
    {
      version: "3.0.1",
      changes: [
        "Fix wrongly display playlist name in notification when removing playlist from playing list",
        "Update what's new page's style in dark mode",
        "Update notification style",
      ],
    },
    {
      version: "3.1.0",
      changes: [
        "New panel introduced! Visit it on https://shuffler.surge.sh/playlistInput/panel/videos.",
        "Filter feature is added on the new Now Playing panel.",
        "Several bugs fix",
      ],
    },
    {
      version: "3.1.1",
      changes: ["Fix blank page problem when unexpected error occurs"],
    },
    {
      version: "3.2.0",
      changes: [
        "Video count is shown on now playing button on drawer",
        "User now can add/remove playlist to now playing by clicking +/- button on drawer",
      ],
    },
    {
      version: "3.3.0",
      changes: [
        "Different icons are now shown based on the number of songs added from playlist to Now Playing list",
      ],
    },
    {
      version: "3.4.0",
      changes: [
        "Added select all and clear selected functions on panel list",
        "Added function to click and play one song, then shuffle the rest",
      ],
    },
    {
      version: "3.5.0",
      changes: [
        "New rename playlist feature",
        "New sync playlist with YouTube feature.",
      ],
    },
    {
      version: "4.0.0-beta",
      changes: [
        "Added new LgPanelDialog in player page",
        "Removed WhatIsNew page and main page",
        "Main page of shuffler is now playlistInput's LgPanel",
        "Changed ytplayer ui",
      ],
    },
    {
      version: "4.0.0",
      changes: [
        "Shuffler is reached stable v4 after long run testing.",
        "Make local storage to store normalized data.",
      ],
    },
    {
      version: "4.1.0",
      changes: [
        "Add changelog button to About page",
        "Fix the problem of rename input dialog staying behind of manage playlist dialog",
      ],
    },
    {
      version: "4.2.0",
      changes: [
        "Add feature to queue selected video after currently playing video",
      ],
    },
  ],
};

export const appGeneral = (state = initialStates, action: AnyAction) => {
  switch (action) {
    default: {
      return state;
    }
  }
};
