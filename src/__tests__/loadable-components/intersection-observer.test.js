jest.dontMock("@loadable/component");

const loadable = require("@loadable/component");
const React = require("react");

const {
  act,
  cleanup,
  render,
  waitForElement
} = require("@testing-library/react");

const {
  IntersectionObserver,
  makeElementsVisible,
  globallyTrackedElements
} = require("../../__mocks__/IntersectionObserver");

global.IntersectionObserver = IntersectionObserver;

const loadableVisiblity = require("../../loadable-components");

const loadedComponent = jest.fn(() => <div data-testid="loaded-component" />);

const loader = () => Promise.resolve(loadedComponent);

const opts = {
  fallback: () => <div data-testid="fallback" />
};

const args = [loader, opts];

const props = { a: 1, b: 2 };

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  globallyTrackedElements.length = 0;
  cleanup();
});

describe("Loadable", () => {
  test("exports", () => {
    expect(typeof loadableVisiblity).toBe("function");
  });

  test("doesnt return loadable", () => {
    // Mock @loadable/component to get a stable `preload` function
    jest.doMock("@loadable/component");

    const loadable = require("@loadable/component");
    const loadableVisiblity = require("../../loadable-components"); // Require our tested module with the above mock applied

    const Loader = loadableVisiblity(loader, opts);

    expect(loadable).toHaveBeenCalledWith(loader, opts);
    expect(Loader).not.toBe(loadable(loader, opts));
  });

  test('calls "loadable" when elements are visible', async () => {
    const Loader = loadableVisiblity(loader);

    const { queryByTestId } = render(<Loader {...props} />);

    expect(loadedComponent).not.toHaveBeenCalled();

    act(() => makeElementsVisible("byRatio"));

    await waitForElement(() => queryByTestId("loaded-component"));

    expect(loadedComponent).toHaveBeenCalledWith(props, expect.anything());
  });

  test('calls "loadable" when intersectionRatio equals 0 but isIntersecting is true', async () => {
    const Loader = loadableVisiblity(loader);

    const { queryByTestId } = render(<Loader {...props} />);

    expect(loadedComponent).not.toHaveBeenCalled();

    act(() => makeElementsVisible("byIntersecting"));

    await waitForElement(() => queryByTestId("loaded-component"));

    expect(loadedComponent).toHaveBeenCalledWith(props, expect.anything());
  });

  test("it clears out tracked elements when they become visible", () => {
    const Loader = loadableVisiblity(loader);

    render(<Loader {...props} />);

    expect(globallyTrackedElements.length).toEqual(1);

    act(() => {
      makeElementsVisible();
    });

    expect(globallyTrackedElements.length).toEqual(0);
  });

  test("preload calls loadable load", () => {
    // Mock @loadable/component to get a stable `preload` function
    jest.doMock("@loadable/component");

    const loadable = require("@loadable/component");
    const loadableVisiblity = require("../../loadable-components"); // Require our tested module with the above mock applied

    loadableVisiblity(loader).preload();

    expect(loadable().preload).toHaveBeenCalled();
  });

  test("preload will cause the loadable component to be displayed", async () => {
    const Loader = loadableVisiblity(loader);

    const { queryByTestId } = render(<Loader {...props} />);
    expect(queryByTestId("loaded-component")).toBeNull();

    act(() => {
      Loader.preload();
    });

    await waitForElement(() => queryByTestId("loaded-component"));

    expect(queryByTestId("loaded-component")).toBeTruthy();
  });

  test("it displays the loadable component when it becomes visible", async () => {
    const Loader = loadableVisiblity(loader);

    const { queryByTestId } = render(
      <Loader {...props} data-testid="loader" className="loader-class-name" />
    );

    expect(queryByTestId("loader").className).toBe("loader-class-name");
    expect(queryByTestId("loaded-component")).toBeNull();

    act(() => {
      makeElementsVisible();
    });

    await waitForElement(() => queryByTestId("loaded-component"));

    expect(queryByTestId("loader")).toBeNull();
    expect(queryByTestId("loaded-component")).toBeTruthy();
  });

  test("it does not set up visibility handlers until mounted", () => {
    const Loader = loadableVisiblity(loader);

    expect(globallyTrackedElements.length).toEqual(0);

    render(<Loader className="my-class-name" />);

    expect(globallyTrackedElements.length).toEqual(1);
  });
});
