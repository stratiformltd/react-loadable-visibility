const Loadable = require('react-loadable')
const React = require('react')
const { mount } = require('enzyme')

const { IntersectionObserver, makeElementsVisible } = require('../__mocks__/IntersectionObserver')

global.IntersectionObserver = IntersectionObserver

const LoadableVisibility = require('../')

const opts = {
  loading: () => null,
  loader: () => Promise.resolve(),
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
