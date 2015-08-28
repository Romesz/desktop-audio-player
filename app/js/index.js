/* global console, window, require */

window.onload = function () {
  var ipc = require('ipc');

  ipc.on('getPlayList', function(playList) {
    console.log(playList);
    // TODO: Front end side of the app
  });
  ipc.send('isServerLive');
};