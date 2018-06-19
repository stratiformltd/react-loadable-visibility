const intersectionObservers = []
const globallyTrackedElements = []

module.exports.globallyTrackedElements = globallyTrackedElements

module.exports.makeElementsVisible = function makeElementsVisible () {
  intersectionObservers.forEach((observer) => {
    const entries = observer.trackedElements.map((element) => {
      return {
        intersectionRatio: 1,
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

    if (globalIndex>= 0) {
      globallyTrackedElements.splice(elementIndex, 1)
    }
  }
}
