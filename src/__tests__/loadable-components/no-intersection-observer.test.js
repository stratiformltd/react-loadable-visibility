const loadable = require('loadable-components')
const LoadableVisibility = require('../../loadable-components')

const opts = {
  loading: () => null,
  loader: () => Promise.resolve(),
}

describe('loadable', () => {
  test('exports', () => {
    expect(typeof LoadableVisibility).toBe('function')
  })

  test('returns loadalbe', () => {
    expect(LoadableVisibility(opts)).toBe(loadable(opts))
  })
})
