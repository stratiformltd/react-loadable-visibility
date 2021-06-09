"use strict";

var _react = _interopRequireWildcard(require("react"));

var _component = _interopRequireDefault(require("@loadable/component"));

var _createLoadableVisibilityComponent = _interopRequireDefault(require("./createLoadableVisibilityComponent"));

var _capacities = require("./capacities");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function loadableVisiblity(load, opts) {
  if (opts === void 0) {
    opts = {};
  }

  if (_capacities.IntersectionObserver) {
    return (0, _createLoadableVisibilityComponent["default"])([load, opts], {
      Loadable: _component["default"],
      preloadFunc: "preload",
      loadFunc: "load",
      LoadingComponent: opts.fallback ? function () {
        return opts.fallback;
      } : null
    });
  } else {
    return (0, _component["default"])(load, opts);
  }
}

module.exports = loadableVisiblity;