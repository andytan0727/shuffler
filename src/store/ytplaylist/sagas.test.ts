import * as ytplaylistSaga from "./sagas";

describe("ytplaylist sagas", () => {
  const addPlaylistsToListToPlaySaga = ytplaylistSaga.addPlaylistsToListToPlay;

  console.log(addPlaylistsToListToPlaySaga);

  test("should success", () => {
    expect(1).toBe(1);
  });
});
