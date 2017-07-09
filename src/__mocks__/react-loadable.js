const LoadableReturn = jest.fn()
const LoadableMapReturn = jest.fn()

const LoadableObject = (props) => {
  LoadableReturn(props)

  return null
}

LoadableObject.preload = jest.fn()

const LoadableMapObject = (props) => {
  LoadableMapReturn(props)

  return null
}

LoadableMapObject.preload = jest.fn()

function Loadable (opts) {
  return LoadableObject
}

Loadable.Map = (opts) => {
  return LoadableMapObject
}

Loadable.LoadableReturn = LoadableReturn
Loadable.LoadableMapReturn = LoadableMapReturn

module.exports = Loadable
