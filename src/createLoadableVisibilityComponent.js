import React, { Component } from 'react'
import { IntersectionObserver } from './capacities'

let intersectionObserver
let trackedElements = new Map()

if (IntersectionObserver) {
  intersectionObserver = new window.IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      const trackedElement = trackedElements.get(entry.target)

      if (trackedElement && entry.intersectionRatio > 0) {
        trackedElement.visibilityHandler()
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
      if (this.loadingRef && trackedElements.get(this.loadingRef)) {
        intersectionObserver.unobserve(this.loadingRef)
        trackedElements.delete(this.loadingRef)
      }

      this.loadingRef = element

      if (element) {
        trackedElements.set(element, this)
        intersectionObserver.observe(element)
      }
    }

    componentWillUnmount() {
      if (this.loadingRef) {
        intersectionObserver.unobserve(this.loadingRef)
        trackedElements.delete(this.loadingRef)
      }

      const handlerIndex = visibilityHandlers.indexOf(this.visibilityHandler)

      if (handlerIndex >= 0) {
        visibilityHandlers.splice(handlerIndex, 1)
      }
    }

    visibilityHandler = () => {
      if (this.loadingRef) {
        intersectionObserver.unobserve(this.loadingRef)
        trackedElements.delete(this.loadingRef)
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
        return <div
          style={{display: 'inline-block', minHeight: '1px', minWidth: '1px'}}
          className={this.props.className}
          ref={this.attachRef}
        >
          {React.createElement(LoadingComponent, {
            isLoading: true,
          })}
        </div>
      }

      return <div
        style={{display: 'inline-block', minHeight: '1px', minWidth: '1px'}}
        className={this.props.className}
        ref={this.attachRef}
      />
    }
  }
}

export default createLoadableVisibilityComponent
