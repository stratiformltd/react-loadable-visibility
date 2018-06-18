const loadable = require('loadable-components')
const React = require('react')
const { mount } = require('enzyme')

const {
  IntersectionObserver,
  makeElementsVisible,
  trackedElements
} = require('../../__mocks__/IntersectionObserver')

global.IntersectionObserver = IntersectionObserver

const loadableVisiblity = require('../../loadable-components')

const opts = {
  loading: () => null,
  loader: () => Promise.resolve(),
}

const props = {'a': 1, 'b': 2}

beforeEach(() => {
  jest.resetAllMocks()
  trackedElements.length = 0
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

    expect(trackedElements.length).toEqual(1)

    makeElementsVisible()

    expect(trackedElements.length).toEqual(0)
  })

  test('preload calls loadable load', () => {
    loadableVisiblity(opts).load()

    expect(loadable().load).toHaveBeenCalled()
  })

  test('preload will cause the loadable component do be displayed', () => {
    const Loader = loadableVisiblity(opts)

    const wrapper = mount(<Loader {...props} />)
    expect(wrapper.find('loadableObject')).toHaveLength(0)

    Loader.load();

    expect(wrapper.find('loadableObject')).toHaveLength(1)
  });

  test('it displays the loadable component when it becomes visible', () => {
    const Loader = loadableVisiblity(opts)

    const wrapper = mount(<Loader {...props} className="loading-class-name" />)
    expect(wrapper.find('.loading-class-name')).toHaveLength(1)
    expect(wrapper.find('loadableObject')).toHaveLength(0)

    makeElementsVisible()

    expect(wrapper.find('.loading-class-name')).toHaveLength(0)
    expect(wrapper.find('loadableObject')).toHaveLength(1)
  });

  test('passes the className prop', () => {
    const Loader = loadableVisiblity(opts)

    const wrapper = mount(<Loader className='my-class-name' />)

    expect(wrapper.find('.my-class-name')).toHaveLength(1)
  })

  test('it does not set up visibility handlers until mounted', () => {
    const Loader = loadableVisiblity(opts)

    expect(trackedElements.length).toEqual(0)

    const wrapper = mount(<Loader className='my-class-name' />)

    expect(trackedElements.length).toEqual(1)
  })
})
