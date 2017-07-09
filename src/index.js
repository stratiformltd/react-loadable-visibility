import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

import Loadable from 'react-loadable'

let intersectionObserver
let trackedElements = {}

if (window && window.IntersectionObserver) {
  intersectionObserver = new window.IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0 && trackedElements[entry.target]) {
        const component = trackedElements[entry.target]

        component.visibilityHandler()
      }
    })
  })
}

function createLoadableVisibilityComponent (opts, Loadable) {
  let preloaded = false
  const visibilityHandlers = []

  const LoadableComponent = Loadable(opts)

  return class LoadableVisibilityComponent extends Component {
    static preload() {
      if (!preloaded) {
        preloaded = true
        visibilityHandlers.forEach((handler) => handler())
      }

      LoadableComponent.preload()
    }

    constructor(props) {
      super(props)

      if (!preloaded) {
        visibilityHandlers.push(this.visibilityHandler)
      }

      this.state = {
        visible: preloaded,
      }
    }

    attachRef = (element) => {
      this.loadingRef = element

      if (element) {
        trackedElements[element] = this
        intersectionObserver.observe(element)
      }
    }

    componentWillUnmount() {
      if (this.loadingRef) {
        intersectionObserver.unobserve(this.loadingRef)
        delete trackedElements[this.loadingRef]
      }

      const handlerIndex = visibilityHandlers.indexOf(this.visibilityHandler)

      if (handlerIndex >= 0) {
        visibilityHandlers.splice(handlerIndex, 1)
      }
    }

    visibilityHandler = () => {
      const node = findDOMNode(this)

      intersectionObserver.unobserve(node)
      delete trackedElements[node]

      this.setState({
        visible: true
      })
    }

    render() {
      if (this.state.visible) {
        return <LoadableComponent {...this.props} />
      } else if (opts.loading) {
        return <span ref={this.attachRef}>
          {React.createElement(opts.loading, {
            isLoading: true,
          })}
        </span>
      } else {
        return <span ref={this.attachRef} />
      }
    }
  }
}

function LoadableVisibility (opts) {
  if (intersectionObserver) {
    return createLoadableVisibilityComponent(opts, Loadable)
  } else {
    return Loadable(opts)
  }
}

function LoadableVisibilityMap (opts) {
  if (intersectionObserver) {
    return createLoadableVisibilityComponent(opts, Loadable.Map)
  } else {
    return Loadable.Map(opts)
  }
}

LoadableVisibility.Map = LoadableVisibilityMap

module.exports = LoadableVisibility
