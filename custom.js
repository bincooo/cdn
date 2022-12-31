(function() {
  'use strict'
  window.___call = (name, args) {
    console.log(name, args, window[name])
    window[name].call(args)
  }
})()
