const loadable = require('loadable-components')
const React = require('react')
const { mount } = require('enzyme')

const { IntersectionObserver, makeElementsVisible } = require('../../__mocks__/IntersectionObserver')

global.IntersectionObserver = IntersectionObserver

const loadableVisiblity = require('../../loadable-components')

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

  test('preload calls loadable load', () => {
    loadableVisiblity(opts).load()

    expect(loadable().load).toHaveBeenCalled()
  })

  test('passes the className prop', () => {
    const Loader = loadableVisiblity(opts)

    const wrapper = mount(<Loader className='my-class-name' />)

    expect(wrapper.find('.my-class-name')).toHaveLength(1)
  })
})
