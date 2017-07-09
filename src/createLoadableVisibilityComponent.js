import React, { Component } from 'react'
import { IntersectionObserver } from './capacities'

let intersectionObserver
let trackedElements = {}

if (IntersectionObserver) {
  intersectionObserver = new window.IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0 && trackedElements[entry.target]) {
        const component = trackedElements[entry.target]

        component.visibilityHandler()
      }
    })
  })
}

function createLoadableVisibilityComponent (args, {
  Loadable,
  preloadFunc,
  LoadingComponent,
}) {
  let preloaded = false
  const visibilityHandlers = []

  const LoadableComponent = Loadable(...args)

  return class LoadableVisibilityComponent extends Component {
    static [preloadFunc]() {
      if (!preloaded) {
        preloaded = true
        visibilityHandlers.forEach((handler) => handler())
      }

      LoadableComponent[preloadFunc]()
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
      if (this.loadingRef) {
        intersectionObserver.unobserve(this.loadingRef)
        delete trackedElements[this.loadingRef]
      }

      this.setState({
        visible: true
      })
    }

    render() {
      if (this.state.visible) {
        return <LoadableComponent {...this.props} />
      }

      if (LoadingComponent) {
        return <span ref={this.attachRef}>
          {React.createElement(LoadingComponent, {
            isLoading: true,
          })}
        </span>
      }

      return <span ref={this.attachRef} />
    }
  }
}

export default createLoadableVisibilityComponent
