const React = require("react");

const loadableReturn = jest.fn();

const loadableObject = props => {
  loadableReturn(props);
  return null;
};

loadableObject.preload = jest.fn();
loadableObject.load = jest.fn();

function loadable(opts) {
  return loadableObject;
}

loadable.loadableReturn = loadableReturn;

module.exports = jest.fn(loadable);
