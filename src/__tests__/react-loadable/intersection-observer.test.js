jest.dontMock("react-loadable");

const Loadable = require("react-loadable");
const React = require("react");

const {
  act,
  cleanup,
  render,
  waitForElement
} = require("@testing-library/react");

const {
  IntersectionObserver,
  makeElementsVisible
} = require("../../__mocks__/IntersectionObserver");

global.IntersectionObserver = IntersectionObserver;

const LoadableVisibility = require("../../react-loadable");

const loadedComponent = jest.fn(() => <div data-testid="loaded-component" />);

const opts = {
  loading: () => null,
  loader: () => Promise.resolve(loadedComponent)
};

const props = { a: 1, b: 2 };

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  cleanup();
});

describe("Loadable", () => {
  test("exports", () => {
    expect(typeof LoadableVisibility).toBe("function");
  });

  test("doesnt return Loadable", () => {
    expect(LoadableVisibility(opts)).not.toBe(Loadable(opts));
  });

  test("calls Loadable when elements are visible", async () => {
    const Loader = LoadableVisibility(opts);

    const { getByTestId } = render(<Loader {...props} />);

    expect(loadedComponent).not.toHaveBeenCalled();

    act(() => {
      makeElementsVisible("byRatio");
    });

    await waitForElement(() => getByTestId("loaded-component"));

    expect(loadedComponent).toHaveBeenCalledWith(props, expect.anything());
  });

  test('calls "loadable" when intersectionRatio equals 0 but isIntersecting is true', async () => {
    const Loader = LoadableVisibility(opts);

    const { getByTestId } = render(<Loader {...props} />);

    expect(loadedComponent).not.toHaveBeenCalled();

    act(() => {
      makeElementsVisible("byIntersecting");
    });

    await waitForElement(() => getByTestId("loaded-component"));

    expect(loadedComponent).toHaveBeenCalledWith(props, expect.anything());
  });

  test("preload calls Loadable preload", () => {
    // Mock react-loadable to get a stable `preload` function
    jest.doMock("react-loadable");

    const Loadable = require("react-loadable");
    const LoadableVisibility = require("../../react-loadable"); // Require our tested module with the above mock applied

    LoadableVisibility(opts).preload();

    expect(Loadable().preload).toHaveBeenCalled();
  });

  test("passes all props", () => {
    const Loader = LoadableVisibility(opts);

    const { getByTestId } = render(<Loader data-testid="loader" />);

    const loader = getByTestId("loader");

    expect(loader).toBeTruthy();
  });

  test("preload will cause the loadable component to be displayed", async () => {
    const Loader = LoadableVisibility(opts);

    const { queryByTestId } = render(<Loader {...props} />);

    expect(queryByTestId("loaded-component")).toBeNull();

    act(() => {
      Loader.preload();
    });

    await waitForElement(() => queryByTestId("loaded-component"));

    expect(queryByTestId("loaded-component")).toBeTruthy();
  });

  test("it displays the loadable component when it becomes visible", async () => {
    const Loader = LoadableVisibility(opts);

    const { debug, queryByTestId } = render(
      <Loader {...props} className="loading-class-name" data-testid="loader" />
    );

    const loader = queryByTestId("loader");

    expect(queryByTestId("loader").className).toBe("loading-class-name");
    expect(queryByTestId("LoadableObject")).toBeNull();

    act(() => {
      makeElementsVisible();
    });

    await waitForElement(() => queryByTestId("loaded-component"));

    expect(queryByTestId("loader")).toBe(null);
    expect(queryByTestId("loaded-component")).toBeTruthy();
  });
});

describe("Loadable.Map", () => {
  test("exports", () => {
    expect(typeof LoadableVisibility.Map).toBe("function");
  });

  test("doesnt return Map", () => {
    // Mock react-loadable to get a stable `preload` function
    jest.doMock("react-loadable");

    const Loadable = require("react-loadable");
    const LoadableVisibility = require("../../react-loadable"); // Require our tested module with the above mock applied

    expect(LoadableVisibility.Map(opts)).not.toBe(Loadable.Map(opts));
  });

  test("calls Map when elements are visible", async () => {
    const loader = {
      Loaded: jest.fn(props => <div {...props} />),
      Stuff: jest.fn(props => <div {...props} />)
    };

    const Loader = LoadableVisibility.Map({
      ...opts,
      loader: {
        Loaded: () => Promise.resolve(loader.Loaded),
        Stuff: () => Promise.resolve(loader.Stuff)
      },
      render({ Loaded, Stuff }, props) {
        return [
          <Loaded {...props} key="loaded" data-testid="loaded-component" />,
          <Stuff {...props} key="stuff" data-testid="stuff-component" />
        ];
      }
    });

    const { getByTestId } = render(<Loader {...props} />);

    expect(loader.Loaded).not.toHaveBeenCalled();
    expect(loader.Stuff).not.toHaveBeenCalled();

    act(() => {
      makeElementsVisible();
    });

    await waitForElement(() => getByTestId("loaded-component"));
    await waitForElement(() => getByTestId("stuff-component"));

    expect(loader.Loaded).toHaveBeenCalledWith(
      {
        ...props,
        "data-testid": "loaded-component"
      },
      expect.anything()
    );
    expect(loader.Stuff).toHaveBeenCalledWith(
      {
        ...props,
        "data-testid": "stuff-component"
      },
      expect.anything()
    );
  });

  test("preload calls Map preload", () => {
    // Mock react-loadable to get a stable `preload` function
    jest.doMock("react-loadable");

    const Loadable = require("react-loadable");
    const LoadableVisibility = require("../../react-loadable"); // Require our tested module with the above mock applied

    LoadableVisibility.Map(opts).preload();

    expect(Loadable.Map().preload).toHaveBeenCalled();
  });
});
