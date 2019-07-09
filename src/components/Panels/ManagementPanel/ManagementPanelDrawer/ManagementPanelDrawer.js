import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from "@material-ui/core";
import {
  MusicNote as MusicNoteIcon,
  PlaylistAdd as PlaylistAddIcon,
  PlayArrow as PlayArrowIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  PlaylistPlay as PlaylistPlayIcon,
} from "@material-ui/icons";

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
  /**
   * ListItemLink forwardRef
   *
   * @param {{ to: string; }} props
   * @param {React.Ref<HTMLDivElement>} ref
   */
  ({ to, ...rest }, ref) => (
    <div ref={ref}>
      <Link to={to} {...rest} />
    </div>
  )
);

/**
 * DrawerNavListItem for ManagementPanelDrawer's nav
 *
 * @param {{
 *   pathUrl: string;
 *   icon:React.ReactElement<import("@material-ui/core/SvgIcon").SvgIconProps>;
 *   primaryText: string;
 *   secondaryActionItem?: React.ReactElement; }} props
 * @returns
 */
const DrawerNavListItem = (props) => {
  const classes = useStyles({});
  const { pathUrl, icon, primaryText, secondaryActionItem } = props;

  return (
    // @ts-ignore
    <ListItem button component={ListItemLink} to={pathUrl}>
      <ListItemIcon className={classes.listItemIcon}>{icon}</ListItemIcon>
      <ListItemText primary={primaryText} />
      {secondaryActionItem}
    </ListItem>
  );
};

DrawerNavListItem.propTypes = {
  pathUrl: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  primaryText: PropTypes.string.isRequired,
  secondaryActionItem: PropTypes.node,
};

/**
 * DrawerPlaylistsNavList component for drawer
 *
 * Lower half of ManagementPanelDrawer. Used to store playlist home & individual items' link
 *
 * @param {{ playlistUrl: string; }} props
 * @returns
 */
const DrawerPlaylistsNavList = (props) => {
  const { playlistUrl } = props;
  const classes = useStyles({});

  /** @type {Array<Playlist>} */
  const playlists = useSelector((state) => state.ytplaylist.playlists);

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

DrawerPlaylistsNavList.propTypes = {
  playlistUrl: PropTypes.string.isRequired,
};

/**
 * ManagementPanelDrawer
 *
 * Drawer for ManagementPanels, e.g. VideosPanel, PlaylistsPanel and so on.
 *
 * @param {{ match: MatchRoute; }} props
 * @returns
 */
const ManagementPanelDrawer = ({ match }) => {
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

ManagementPanelDrawer.propTypes = {
  match: PropTypes.object.isRequired,
};

export default ManagementPanelDrawer;
