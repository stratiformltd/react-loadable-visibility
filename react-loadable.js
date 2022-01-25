"use strict";

var _react = _interopRequireWildcard(require("react"));

var _reactLoadable = _interopRequireDefault(require("react-loadable"));

var _createLoadableVisibilityComponent = _interopRequireDefault(require("./createLoadableVisibilityComponent"));

var _capacities = require("./capacities");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function LoadableVisibility(opts) {
  if (_capacities.IntersectionObserver) {
    return (0, _createLoadableVisibilityComponent["default"])([opts], {
      Loadable: _reactLoadable["default"],
      preloadFunc: 'preload',
      LoadingComponent: opts.loading
    });
  } else {
    return (0, _reactLoadable["default"])(opts);
  }
}

function LoadableVisibilityMap(opts) {
  if (_capacities.IntersectionObserver) {
    return (0, _createLoadableVisibilityComponent["default"])([opts], {
      Loadable: _reactLoadable["default"].Map,
      preloadFunc: 'preload',
      LoadingComponent: opts.loading
    });
  } else {
    return _reactLoadable["default"].Map(opts);
  }
}

LoadableVisibility.Map = LoadableVisibilityMap;
module.exports = LoadableVisibility;