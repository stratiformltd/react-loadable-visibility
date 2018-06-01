import * as React from 'react'
import { IntersectionObserver } from './capacities'
import trackedElements from './tracked_elements'

let intersectionObserver

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

  const LoadableComponent = Loadable(...args)

  return class LoadableVisibilityComponent extends React.Component {
    static [preloadFunc]() {
      preloaded = true
      LoadableComponent[preloadFunc]()
    }

    constructor(props) {
      super(props)
      this.state = {
        visible: preloaded,
      }
    }

    componentDidMount() {
      if (!preloaded) {
        const element = this.refs.loading
        trackedElements.set(element, this)
        intersectionObserver.observe(element)
      }
    }

    componentWillUnmount() {
      const element = this.refs.loading

      if (element) {
        intersectionObserver.unobserve(element)
        trackedElements.delete(element)
      }
    }

    visibilityHandler = () => {
      const element = this.refs.loading

      if (element) {
        intersectionObserver.unobserve(element)
        trackedElements.delete(element)
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
          ref="loading"
        >
          {React.createElement(LoadingComponent, {
            isLoading: true,
          })}
        </div>
      }

      return <div
        style={{display: 'inline-block', minHeight: '1px', minWidth: '1px'}}
        className={this.props.className}
        ref="loading"
      />
    }
  }
}

export default createLoadableVisibilityComponent
