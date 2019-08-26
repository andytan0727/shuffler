import {
  AddPlaylistToPlayingBtn,
  RemovePlaylistFromPlayingBtn,
} from "components/Buttons";
import {
  AllPlaylistInPlayingIcon,
  PartialPlaylistInPlayingIcon,
} from "components/Icons";
import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectListToPlayTotalItems } from "store/ytplaylist/listToPlaySelectors";
import { selectAllPlaylists } from "store/ytplaylist/playlistSelectors";

import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import {
  GridOn as GridOnIcon,
  List as ListIcon,
  PlayArrow as PlayArrowIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  VideoLibrary as VideoLibraryIcon,
} from "@material-ui/icons";

interface DrawerNavListItemProps {
  pathUrl: string;
  icon: React.ReactElement<import("@material-ui/core/SvgIcon").SvgIconProps>;
  primaryText: string;
  secondaryActionItem?: React.ReactElement;
}

interface NowPlayingDrawerNavListItemProps {
  panelUrl: string;
}

interface DrawerPlaylistsNavListProps {
  playlistUrl: string;
}

interface LgPanelDrawerProps {
  match: MatchRoute;
}

const useStyles = makeStyles((theme) => ({
  drawerPlaceholder: {
    position: "relative",
    width: "250px",
    zIndex: -100,
  },
  drawerNavList: {
    position: "fixed",
    left: "0%",
    width: "250px",
    height: "100%",
    borderRight: `2px solid ${theme.palette.divider}`,
  },
  drawerNowPlayingSecondaryAction: {
    userSelect: "none",
  },
  drawerPlaylistsNavContainer: {
    // 48px = height of one MUI list item
    height: "calc(100% - 48px*3)",
    paddingTop: 0,
  },
  drawerPlaylistsNavLinks: {
    // 16px = padding top + padding bottom of MUI list item
    height: "calc(100% - 48px*3 + 16px)",
    overflowY: "auto",

    // prevent text overflow of long playlist id/name
    "& .MuiListItemText-primary": {
      display: "inline-block",
      width: "8rem",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
  listItemIcon: {
    minWidth: 40,
  },
}));

const ListItemLink = forwardRef(
  (
    { to, ...rest }: { to: string; rest: any },
    ref: React.Ref<HTMLDivElement>
  ) => (
    <div ref={ref}>
      <Link to={to} {...rest} />
    </div>
  )
);

ListItemLink.displayName = "ListItemLink";

/**
 * DrawerNavListItem for LgPanelDrawer's nav

 */
const DrawerNavListItem = (props: DrawerNavListItemProps) => {
  const classes = useStyles();
  const { pathUrl, icon, primaryText, secondaryActionItem } = props;

  return (
    <ListItem button component={ListItemLink as any} to={pathUrl}>
      <ListItemIcon className={classes.listItemIcon}>{icon}</ListItemIcon>
      <ListItemText primary={primaryText} />
      {secondaryActionItem}
    </ListItem>
  );
};

const DrawerNowPlayingNavListItem = (
  props: NowPlayingDrawerNavListItemProps
) => {
  const { panelUrl } = props;
  const classes = useStyles();
  const totalNowPlayingItems = useSelector(selectListToPlayTotalItems);

  return (
    <DrawerNavListItem
      pathUrl={`${panelUrl}/playing`}
      icon={<PlayArrowIcon />}
      primaryText={`Now Playing`}
      secondaryActionItem={
        <ListItemSecondaryAction
          className={classes.drawerNowPlayingSecondaryAction}
        >
          {totalNowPlayingItems}{" "}
          <span role="img" aria-label="musical-emoji">
            🎶
          </span>
        </ListItemSecondaryAction>
      }
    />
  );
};

/**
 * DrawerPlaylistsNavList component for drawer
 *
 * Lower half of LgPanelDrawer. Used to store playlist home & individual items' link
 *
 */
const DrawerPlaylistsNavList = (props: DrawerPlaylistsNavListProps) => {
  const { playlistUrl } = props;
  const classes = useStyles({});
  const playlists = useSelector(selectAllPlaylists);
  const playlistIds = Object.keys(playlists);

  return (
    <List className={classes.drawerPlaylistsNavContainer} component="nav">
      <DrawerNavListItem
        pathUrl={playlistUrl}
        icon={<GridOnIcon />}
        primaryText="Playlists"
      />

      <Divider />

      <div className={classes.drawerPlaylistsNavLinks}>
        {playlistIds.map((playlistId) => (
          <DrawerNavListItem
            key={playlistId}
            pathUrl={`${playlistUrl}/${playlistId}`}
            icon={
              playlists[playlistId].allInPlaying ? (
                <AllPlaylistInPlayingIcon />
              ) : playlists[playlistId].partialInPlaying ? (
                <PartialPlaylistInPlayingIcon />
              ) : (
                <ListIcon />
              )
            }
            primaryText={playlists[playlistId].name || `Playlist-${playlistId}`}
            secondaryActionItem={
              <ListItemSecondaryAction>
                {playlists[playlistId].allInPlaying ? (
                  <RemovePlaylistFromPlayingBtn
                    playlistId={playlistId}
                    iconSize="default"
                  />
                ) : (
                  <AddPlaylistToPlayingBtn
                    playlistId={playlistId}
                    iconSize="default"
                  />
                )}
              </ListItemSecondaryAction>
            }
          />
        ))}
      </div>
    </List>
  );
};

/**
 * LgPanelDrawer
 *
 * Drawer for LgPanels, e.g. VideosPanel, PlaylistsPanel and so on.
 *
 */
const LgPanelDrawer = ({ match }: LgPanelDrawerProps) => {
  const classes = useStyles({});
  const panelUrl = match.url;

  return (
    <div>
      <div className={classes.drawerNavList}>
        <List component="nav">
          <DrawerNavListItem
            pathUrl={`${panelUrl}/videos`}
            icon={<VideoLibraryIcon />}
            primaryText="My video"
          />
          <DrawerNavListItem
            pathUrl={`${panelUrl}/recent`}
            icon={<PlayCircleOutlineIcon />}
            primaryText="Recently Played"
          />
          <DrawerNowPlayingNavListItem panelUrl={panelUrl} />
        </List>
        <Divider />
        <DrawerPlaylistsNavList playlistUrl={`${panelUrl}/playlists`} />
      </div>
      <div className={classes.drawerPlaceholder}></div>
    </div>
  );
};

export default LgPanelDrawer;
