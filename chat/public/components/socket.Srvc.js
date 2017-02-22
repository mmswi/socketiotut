(function() {
  'use strict';

  angular
    .module('app')
    .factory('socket', socket);

  socket.$inject = ['$rootScope'];

  function socket($rootScope) {
    let socket = io.connect();
    return {
        on: on,
        emit: emit
    }
    // Socket 'on' and 'emit' methods here
      function on(eventName, callback) {
          socket.on(eventName, function() {
              let args = arguments
              $rootScope.$apply(()=> {
                  callback.apply(socket, args)
              })
          })
      }

      function emit(eventName, data, callback) {
          socket.emit(eventName, data, function() {
              let args = arguments
              $rootScope.$apply(()=> {
                  if(callback) {
                      callback.apply(socket, args)
                  }
              })
          })
      }
  };
})();