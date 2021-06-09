import React, { Component } from 'react'
import Loadable from 'react-loadable'
import createLoadableVisibilityComponent from './createLoadableVisibilityComponent'
import { IntersectionObserver } from './capacities'

function LoadableVisibility (opts) {
  if (IntersectionObserver) {
    return createLoadableVisibilityComponent([opts], {
      Loadable,
      preloadFunc: 'preload',
      /* Preload helps in synchronously loading a component and returns a promise */
      loadFunc: 'preload',
      LoadingComponent: opts.loading,
    })
  } else {
    return Loadable(opts)
  }
}

function LoadableVisibilityMap (opts) {
  if (IntersectionObserver) {
    return createLoadableVisibilityComponent([opts], {
      Loadable: Loadable.Map,
      preloadFunc: 'preload',
      loadFunc: 'preload',
      LoadingComponent: opts.loading,
    })
  } else {
    return Loadable.Map(opts)
  }
}

LoadableVisibility.Map = LoadableVisibilityMap

module.exports = LoadableVisibility
