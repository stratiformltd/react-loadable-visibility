const loadableReturn = jest.fn()

const loadableObject = (props) => {
  loadableReturn(props)
  return null
}

loadableObject.load = jest.fn()

function loadable (opts) {
  return loadableObject
}

loadable.loadableReturn = loadableReturn

module.exports = loadable
