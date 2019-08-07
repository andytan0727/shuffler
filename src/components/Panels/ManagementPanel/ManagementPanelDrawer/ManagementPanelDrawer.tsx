import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPlaylists } from "store/ytplaylist/selector";

import {
  Divider,
  IconButton,
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
  PlaylistAdd as PlaylistAddIcon,
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
  const classes = useStyles({});
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

  const playlists = useSelector(selectPlaylists);

  return (
    <List className={classes.drawerPlaylistsNavContainer} component="nav">
      <DrawerNavListItem
        pathUrl={playlistUrl}
        icon={<PlayArrowIcon />}
        primaryText="Playlists"
        secondaryActionItem={
          <ListItemSecondaryAction>
            <IconButton>
              <PlaylistAddIcon />
            </IconButton>
          </ListItemSecondaryAction>
        }
      />

      <Divider />

      <div className={classes.drawerPlaylistsNavLinks}>
        {playlists.map((playlist) => (
          <DrawerNavListItem
            key={playlist.id}
            pathUrl={`${playlistUrl}/${playlist.id}`}
            icon={<PlaylistPlayIcon />}
            primaryText={playlist.name || `Playlist-${playlist.id}`}
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
