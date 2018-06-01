const loadable = require('loadable-components')
const React = require('react')
const { mount } = require('enzyme')

const { IntersectionObserver, makeElementsVisible } = require('../../__mocks__/IntersectionObserver')

global.IntersectionObserver = IntersectionObserver

const loadableVisiblity = require('../../loadable-components')
const trackedElements = require('../../tracked_elements').default

const opts = {
  loading: () => null,
  loader: () => Promise.resolve(),
}

const props = {'a': 1, 'b': 2}

beforeEach(() => {
  jest.resetAllMocks()
  trackedElements.clear()
})

describe('Loadable', () => {
  test('exports', () => {
    expect(typeof loadableVisiblity).toBe('function')
  })

  test('doesnt return loadable', () => {
    expect(loadableVisiblity(opts)).not.toBe(loadable(opts))
  })

  test('calls "loadable" when elements are visible', () => {
    const Loader = loadableVisiblity(opts)

    const wrapper = mount(<Loader {...props} />)

    expect(loadable.loadableReturn).not.toHaveBeenCalled()

    makeElementsVisible()

    expect(loadable.loadableReturn).toHaveBeenCalledWith(props)
  })

  test('it clears out tracked elements when they become visible', () => {
    const Loader = loadableVisiblity(opts)

    const wrapper = mount(<Loader {...props} />)

    expect(trackedElements.size).toEqual(1)

    makeElementsVisible()

    expect(trackedElements.size).toEqual(0)
  })

  test('preload calls loadable load', () => {
    loadableVisiblity(opts).load()

    expect(loadable().load).toHaveBeenCalled()
  })

  test('passes the className prop', () => {
    const Loader = loadableVisiblity(opts)

    const wrapper = mount(<Loader className='my-class-name' />)

    expect(wrapper.find('.my-class-name')).toHaveLength(1)
  })

  test('it does not set up visibility handlers until mounted', () => {
    const Loader = loadableVisiblity(opts)

    expect(trackedElements.size).toEqual(0)

    const wrapper = mount(<Loader className='my-class-name' />)

    expect(trackedElements.size).toEqual(1)
  })
})
