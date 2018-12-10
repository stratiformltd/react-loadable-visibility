const Loadable = require('react-loadable')
const React = require('react')
const { mount } = require('enzyme')

const { IntersectionObserver, makeElementsVisible } = require('../../__mocks__/IntersectionObserver')

global.IntersectionObserver = IntersectionObserver

const LoadableVisibility = require('../../')

const opts = {
  loading: () => null,
  loader: () => Promise.resolve(),
  observerOptions: { 'a': 'test' }
}

const props = {'a': 1, 'b': 2}

beforeEach(() => {
  jest.resetAllMocks()
})

describe('Loadable', () => {
  test('exports', () => {
    expect(typeof LoadableVisibility).toBe('function')
  })

  test('doesnt return Loadable', () => {
    expect(LoadableVisibility(opts)).not.toBe(Loadable(opts))
  })

  test('calls Loadable when elements are visible', () => {
    const Loader = LoadableVisibility(opts)

    const wrapper = mount(<Loader {...props} />)

    expect(Loadable.LoadableReturn).not.toHaveBeenCalled()

    makeElementsVisible()

    expect(Loadable.LoadableReturn).toHaveBeenCalledWith(props)
  })

  test('preload calls Loadable preload', () => {
    LoadableVisibility(opts).preload()

    expect(Loadable().preload).toHaveBeenCalled()
  })

  test('passes the className prop', () => {
    const Loader = LoadableVisibility({opts})

    const wrapper = mount(<Loader className='my-class-name' />)

    expect(wrapper.find('.my-class-name')).toHaveLength(1)
  })

  test('preload will cause the loadable component to be displayed', () => {
    const Loader = LoadableVisibility(opts)

    const wrapper = mount(<Loader {...props} />)
    expect(wrapper.find('LoadableObject')).toHaveLength(0)

    Loader.preload();

    expect(wrapper.find('LoadableObject')).toHaveLength(1)
  });

  test('it displays the loadable component when it becomes visible', () => {
    const Loader = LoadableVisibility(opts)

    const wrapper = mount(<Loader {...props} className="loading-class-name" />)
    expect(wrapper.find('.loading-class-name')).toHaveLength(1)
    expect(wrapper.find('LoadableObject')).toHaveLength(0)

    makeElementsVisible()

    expect(wrapper.find('.loading-class-name')).toHaveLength(0)
    expect(wrapper.find('LoadableObject')).toHaveLength(1)
  });

  test('it should call setIntersectionObserver with observerOptions', () => {
    const mock = jest.fn().mockImplementation(() => {
      return {
        observe: () => {},
      }
    })

    global.IntersectionObserver = mock

    const Loader = LoadableVisibility(opts)

    mount(<Loader {...props} />)

    expect(mock).toHaveBeenCalledWith(expect.anything(), opts.observerOptions)
    global.IntersectionObserver = IntersectionObserver
  });
})

describe('Loadable.Map', () => {
  test('exports', () => {
    expect(typeof LoadableVisibility.Map).toBe('function')
  })

  test('doesnt return Map', () => {
    expect(LoadableVisibility.Map(opts)).not.toBe(Loadable.Map(opts))
  })

  test('calls Map when elements are visible', () => {
    const Loader = LoadableVisibility.Map(opts)

    const wrapper = mount(<Loader {...props} />)

    expect(Loadable.LoadableMapReturn).not.toHaveBeenCalled()

    makeElementsVisible()

    expect(Loadable.LoadableMapReturn).toHaveBeenCalledWith(props)
  })

  test('preload calls Map preload', () => {
    LoadableVisibility.Map(opts).preload()

    expect(Loadable.Map().preload).toHaveBeenCalled()
  })
})
