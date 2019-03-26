import { dbPlaylist, dbFetchedItem } from "./dbHelper";
import { addPlaylist, setLoadedFromDB } from "../../store/ytplaylist/action";
import { addFetchedItemId } from "../../store/ytapi/action";

/**
 * Hydrate states stored in indexedDB to Redux
 *
 * @param {*} store Redux store
 */
export const hydrateRedux = async store => {
  try {
    // hydrate fetchedItemsId
    const fetchedItemsIdArr = await dbFetchedItem.getItem("fetchedItems");

    if (!fetchedItemsIdArr || !fetchedItemsIdArr.length) {
      throw new Error("fetchedItemsId is not found in indexedDB");
    }

    fetchedItemsIdArr.forEach(itemId => {
      store.dispatch(
        addFetchedItemId({
          persist: false,
          itemId
        })
      );
    });

    // hydrate playlist
    const dbPlaylistKeys = await dbPlaylist.keys();
    if (!dbPlaylistKeys.length) {
      throw new Error("Playlist is not found in indexedDB");
    }

    await dbPlaylist.iterate((value, _) => {
      console.log("value = ", value);
      store.dispatch(
        addPlaylist({
          persist: false,
          playlist: value
        })
      );
    });

    console.log("Successfully hydrates Redux with stored indexedDB data");

    // set loadedFromDB to true
    store.dispatch(setLoadedFromDB());
  } catch (err) {
    console.error(err.message);
  }
};
