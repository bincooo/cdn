(function() {
  'use strict'
  let intervalId = null
  intervalId = setInterval(() => {
    if (document.body.hasAttribute('data-position')) {
      const jsonString = document.body.getAttribute('data-position')
      cosnt position = JSON.parse(jsonString)
      if (captchaSolverCall) {
        captchaSolverCall({
          x: position.left + 19,
          y: position.top + 19
        })
        clearInterval(intervalId)
      }
    }
  }, 1200)
})()
