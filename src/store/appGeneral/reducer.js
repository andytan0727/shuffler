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
  ],
};

export const appGeneral = (state = initialStates, action) => {
  switch (action) {
    default: {
      return state;
    }
  }
};
