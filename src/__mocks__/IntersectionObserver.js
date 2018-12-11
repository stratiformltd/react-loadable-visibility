const intersectionObservers = []
const globallyTrackedElements = []
const elementVisibilityStates = {
  byIntersecting: {
    isIntersecting: true,
    intersectionRatio: 0,
  },
  byRatio: {
    isIntersecting: undefined,
    intersectionRatio: 0.1,
  }
}

module.exports.globallyTrackedElements = globallyTrackedElements

/**
 * @param {'byIntersecting' | 'byRatio'} mode
 */
module.exports.makeElementsVisible = function makeElementsVisible (mode = 'byRatio') {
  const intersectionObject = elementVisibilityStates[mode];
  intersectionObservers.forEach((observer) => {
    const entries = observer.trackedElements.map((element) => {
      return {
        ...intersectionObject,
        target: element,
      }
    })

    observer.callback(entries, observer)
  })
}

module.exports.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback

    this.trackedElements = []

    intersectionObservers.push(this)
  }

  observe(element) {
    this.trackedElements.push(element)
    globallyTrackedElements.push(element)
  }

  unobserve(element) {
    const elementIndex = this.trackedElements.indexOf(element)

    if (elementIndex >= 0) {
      this.trackedElements.splice(elementIndex, 1)
    }

    const globalIndex = globallyTrackedElements.indexOf(element)

    if (globalIndex >= 0) {
      globallyTrackedElements.splice(elementIndex, 1)
    }
  }
}
