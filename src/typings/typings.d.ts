import { ActionType } from "typesafe-actions";

import { TypeBackground } from "@material-ui/core/styles/createPalette";

declare global {
  type SchemaType = "playlistItems" | "videoItems";
  type MediaSourceType = "playlists" | "videos";
  type ItemType = MediaSourceType;

  interface BaseItemsEntity {
    id: string;
    kind: string;
  }

  interface BaseSourceEntity {
    id: string;
    items: string[];
  }

  interface BaseSnippetsEntity {
    id?: string;
    title: string;
  }

  interface PlainObject {
    [key: string]: unknown;
  }

  interface BaseFetchParams {
    apiKey: string;
    part: string;
    maxResults: string;
    fields: string[];
  }

  interface MatchRoute {
    isExact: boolean;
    url: string;
    path: string;
    params: {
      id: string;
    };
  }

  type PlaylistParams = BaseFetchParams & {
    playlistId?: string;
    pageToken?: string;
  };

  type VideoParams = BaseFetchParams & {
    id?: string;
  };

  type FetchParams = PlaylistParams & VideoParams;

  type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
  type OnClickEvent = React.MouseEvent<HTMLDivElement | HTMLButtonElement>;

  // for jest testing only
  namespace NodeJS {
    interface Global {
      fetchedPlaylistItems: import("store/ytplaylist/types").PlaylistItem[];
      fetchedVideoItem: import("store/ytplaylist/types").VideoItem;
      playlist: import("store/ytplaylist/types").FetchedPlaylist;
      video: FetchedVideo;
      url: string;
      playlistParams: BaseFetchParams & PlaylistParams;
      playlistNextParams: BaseFetchParams & PlaylistParams;
      videoParams: BaseFetchParams & VideoParams;

      // ==========================================
      // ytplaylist Related
      // ==========================================
      // bare bone empty states
      basePlaylists: import("store/ytplaylist/types").Playlists;
      baseVideos: import("store/ytplaylist/types").Videos;
      baseListToPlay: import("store/ytplaylist/types").ListToPlay;

      // with some default values
      playlists: import("store/ytplaylist/types").Playlists;
      videos: import("store/ytplaylist/types").Videos;
      // ==========================================
      // End ytplaylist Related
      // ==========================================
    }
  }
}

declare module "typesafe-actions" {
  interface Types {
    RootAction: ActionType<typeof import("../store").default>;
  }
}

declare module "react-router-dom" {
  export const useHistory: () => import("react-router-dom").RouteComponentProps["history"];

  export const useRouteMatch: () => MatchRoute;
}

// extends MUI default palette background colors
declare module "@material-ui/core/styles/createPalette" {
  interface TypeBackground {
    black: string;
    blackLight: string;
    lightGrey: string;
    darkGrey: string;
    blackDark: string;
    softBlack: string;
  }
}
