import {
  AddPlaylistToPlayingBtn,
  RemovePlaylistFromPlayingBtn,
} from "components/Buttons";
import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAllNormPlaylists } from "store/ytplaylist/normSelector";

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
  MusicNote as MusicNoteIcon,
  PlayArrow as PlayArrowIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  PlaylistPlay as PlaylistPlayIcon,
} from "@material-ui/icons";

interface DrawerNavListItemProps {
  pathUrl: string;
  icon: React.ReactElement<import("@material-ui/core/SvgIcon").SvgIconProps>;
  primaryText: string;
  secondaryActionItem?: React.ReactElement;
}

interface DrawerPlaylistsNavListProps {
  playlistUrl: string;
}

interface ManagementPanelDrawerProps {
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
 * DrawerNavListItem for ManagementPanelDrawer's nav

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

/**
 * DrawerPlaylistsNavList component for drawer
 *
 * Lower half of ManagementPanelDrawer. Used to store playlist home & individual items' link
 *
 */
const DrawerPlaylistsNavList = (props: DrawerPlaylistsNavListProps) => {
  const { playlistUrl } = props;
  const classes = useStyles({});
  const playlists = useSelector(selectAllNormPlaylists);
  const playlistIds = Object.keys(playlists);

  return (
    <List className={classes.drawerPlaylistsNavContainer} component="nav">
      <DrawerNavListItem
        pathUrl={playlistUrl}
        icon={<PlayArrowIcon />}
        primaryText="Playlists"
      />

      <Divider />

      <div className={classes.drawerPlaylistsNavLinks}>
        {playlistIds.map((playlistId) => (
          <DrawerNavListItem
            key={playlistId}
            pathUrl={`${playlistUrl}/${playlistId}`}
            icon={<PlaylistPlayIcon />}
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
 * ManagementPanelDrawer
 *
 * Drawer for ManagementPanels, e.g. VideosPanel, PlaylistsPanel and so on.
 *
 */
const ManagementPanelDrawer = ({ match }: ManagementPanelDrawerProps) => {
  const classes = useStyles({});
  const panelUrl = match.url;

  return (
    <div>
      <div className={classes.drawerNavList}>
        <List component="nav">
          <DrawerNavListItem
            pathUrl={`${panelUrl}/videos`}
            icon={<MusicNoteIcon />}
            primaryText="My video"
          />
          <DrawerNavListItem
            pathUrl={`${panelUrl}/recent`}
            icon={<PlayCircleOutlineIcon />}
            primaryText="Recently Played"
          />
          <DrawerNavListItem
            pathUrl={`${panelUrl}/playing`}
            icon={<PlayArrowIcon />}
            primaryText="Now Playing"
          />
        </List>
        <Divider />
        <DrawerPlaylistsNavList playlistUrl={`${panelUrl}/playlists`} />
      </div>
      <div className={classes.drawerPlaceholder}></div>
    </div>
  );
};

export default ManagementPanelDrawer;
