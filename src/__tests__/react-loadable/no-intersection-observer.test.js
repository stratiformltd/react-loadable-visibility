const Loadable = require("react-loadable");
const LoadableVisibility = require("../../react-loadable");

const opts = {
  loading: () => null,
  loader: () => Promise.resolve()
};

describe("Loadable", () => {
  test("exports", () => {
    expect(typeof LoadableVisibility).toBe("function");
  });

  test("returns Loadable", () => {
    expect(LoadableVisibility(opts)).toBe(Loadable(opts));
  });
});

describe("Loadable.Map", () => {
  test("exports", () => {
    expect(typeof LoadableVisibility.Map).toBe("function");
  });

  test("returns Map", () => {
    expect(LoadableVisibility.Map(opts)).toBe(Loadable.Map(opts));
  });
});
