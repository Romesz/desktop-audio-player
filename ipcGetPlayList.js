/* global require, __dirname, console, exports */
exports.getPlayList = function() {
  var ipc = require('ipc');
  var fs = require('fs');
  ipc.on('isServerLive', function(event) {
    fs.readdir(__dirname + '/app/music', function(err, playList) {
      if(err) console.log(err);

      event.sender.send('getPlayList', playList);
    });
  });
};