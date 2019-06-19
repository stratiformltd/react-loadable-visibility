import React, { Component } from "react";
import loadable from "@loadable/component";
import createLoadableVisibilityComponent from "./createLoadableVisibilityComponent";
import { IntersectionObserver } from "./capacities";

function loadableVisiblity(load, opts = {}) {
  if (IntersectionObserver) {
    return createLoadableVisibilityComponent([load, opts], {
      Loadable: loadable,
      preloadFunc: "preload",
      LoadingComponent: opts.fallback ? () => opts.fallback : null
    });
  } else {
    return loadable(load, opts);
  }
}

module.exports = loadableVisiblity;
