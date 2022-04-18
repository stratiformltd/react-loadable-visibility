import React, { Component } from "react";
import loadable from "@loadable/component";
import createLoadableVisibilityComponent from "./createLoadableVisibilityComponent";
import { IntersectionObserver } from "./capacities";
import loadableConfig from "./isBotSingleton";
import createLoadable from "./createLoadable";

function loadableVisiblity(load, opts = {}, intersectionObserverOptions) {
  if (IntersectionObserver) {
    return createLoadableVisibilityComponent([load, opts], {
      Loadable: loadable,
      preloadFunc: "preload",
      LoadingComponent: opts.fallback ? () => opts.fallback : null,
      intersectionObserverOptions,
    });
  } else {
    return createLoadable(load, opts, loadable);
  }
}

export default loadableVisiblity;
