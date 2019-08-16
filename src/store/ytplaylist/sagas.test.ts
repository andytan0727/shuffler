import * as ytplaylistNormedSagas from "./normSagas";

describe("ytplaylist sagas", () => {
  const addNormListToPlayItemWatcher = ytplaylistNormedSagas.addNormListToPlayItemWatcher();

  console.log(addNormListToPlayItemWatcher);

  test("should success", () => {
    expect(1).toBe(1);
  });
});
