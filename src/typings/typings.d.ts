import { ActionType } from "typesafe-actions";

declare global {
  type SchemaType = "playlistItems" | "videoItems";
  type MediaSourceType = "playlists" | "videos";
  type ItemType = MediaSourceType;

  interface BaseItemsEntity {
    id: string;
    kind: string;
    etag: string;
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

  type PlaylistParams = BaseFetchParams & {
    playlistId?: string;
    pageToken?: string;
  };

  type VideoParams = BaseFetchParams & {
    id?: string;
  };

  type FetchParams = PlaylistParams & VideoParams;

  type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
  type ButtonOnClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
}

declare module "typesafe-actions" {
  interface Types {
    RootAction: ActionType<typeof import("../store").default>;
  }
}
