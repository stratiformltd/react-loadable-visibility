const intersectionObservers = []
const trackedElements = []

module.exports.trackedElements = trackedElements

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

    this.trackedElements = trackedElements

    intersectionObservers.push(this)
  }

  observe(element) {
    this.trackedElements.push(element)
  }

  unobserve(element) {
    const elementIndex = this.trackedElements.indexOf(element)

    if (elementIndex >= 0) {
      this.trackedElements.splice(elementIndex, 1)
    }
  }
}
