"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _capacities = require("./capacities");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var intersectionObserver;
var trackedElements = new Map();

if (_capacities.IntersectionObserver) {
  intersectionObserver = new window.IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      var visibilityHandler = trackedElements.get(entry.target);

      if (visibilityHandler && (entry.isIntersecting || entry.intersectionRatio > 0)) {
        visibilityHandler();
      }
    });
  });
}

function createLoadableVisibilityComponent(args, _ref) {
  var Loadable = _ref.Loadable,
      preloadFunc = _ref.preloadFunc,
      loadFunc = _ref.loadFunc,
      LoadingComponent = _ref.LoadingComponent;
  var preloaded = false,
      loaded = false;
  var visibilityHandlers = [];
  var LoadableComponent = Loadable.apply(void 0, args);

  function LoadableVisibilityComponent(props) {
    var visibilityElementRef = (0, _react.useRef)();

    var _useState = (0, _react.useState)(preloaded),
        isVisible = _useState[0],
        setVisible = _useState[1];

    function visibilityHandler() {
      if (visibilityElementRef.current) {
        intersectionObserver.unobserve(visibilityElementRef.current);
        trackedElements["delete"](visibilityElementRef.current);
      }

      setVisible(true);
    }

    (0, _react.useEffect)(function () {
      var element = visibilityElementRef.current;

      if (!isVisible && element) {
        visibilityHandlers.push(visibilityHandler);
        trackedElements.set(element, visibilityHandler);
        intersectionObserver.observe(element);
        return function () {
          var handlerIndex = visibilityHandlers.indexOf(visibilityHandler);

          if (handlerIndex >= 0) {
            visibilityHandlers.splice(handlerIndex, 1);
          }

          intersectionObserver.unobserve(element);
          trackedElements["delete"](element);
        };
      }
    }, [isVisible, visibilityElementRef.current]);

    if (isVisible) {
      return _react["default"].createElement(LoadableComponent, props);
    }

    if (LoadingComponent || props.fallback) {
      return _react["default"].createElement("div", _extends({
        style: {
          display: "inline-block",
          minHeight: "1px",
          minWidth: "1px"
        }
      }, props, {
        ref: visibilityElementRef
      }), LoadingComponent ? _react["default"].createElement(LoadingComponent, _extends({
        isLoading: true
      }, props)) : props.fallback);
    }

    return _react["default"].createElement("div", _extends({
      style: {
        display: "inline-block",
        minHeight: "1px",
        minWidth: "1px"
      }
    }, props, {
      ref: visibilityElementRef
    }));
  }

  LoadableVisibilityComponent[preloadFunc] = function () {
    if (!preloaded) {
      preloaded = true;
      visibilityHandlers.forEach(function (handler) {
        return handler();
      });
    }

    return LoadableComponent[preloadFunc]();
  };

  LoadableVisibilityComponent[loadFunc] = function () {
    if (!loaded) {
      loaded = true;
      visibilityHandlers.forEach(function (handler) {
        return handler();
      });
    }

    return LoadableComponent[loadFunc]();
  };

  return LoadableVisibilityComponent;
}

var _default = createLoadableVisibilityComponent;
exports["default"] = _default;