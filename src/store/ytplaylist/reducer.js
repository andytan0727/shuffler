import produce from "immer";

const initialState = {
  playlistId: "",
  items: []
};

export const ytplaylist = produce((draft, action) => {
  switch (action.type) {
    default: {
      return draft;
    }
  }
}, initialState);
