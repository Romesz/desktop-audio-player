/* global require, __dirname, console, exports, Buffer */
var ipc = require('ipc');
var fs = require('fs');
exports.getPlayList = function() {
  ipc.on('isServerLive', function(event) {
    fs.readdir(__dirname + '/app/music', function(err, playList) {
      if(err) console.log(err);

      event.sender.send('getPlayList', playList);
    });
  });
};

exports.delMusic = function() {
  ipc.on('delMusicByIndex', function(event, index) {
    fs.readdir(__dirname + '/app/music', function(err, playList) {
      if(err) console.log(err);

      var musicSource = playList[index];
      fs.unlink(__dirname + '/app/music/' + musicSource, function(err) {
        if(err) console.log(err);

        playList.splice(index, 1);
        event.sender.send('getPlayListAfterDel', playList);
      });
    });
  });
};

exports.uploadMusic = function() {
  ipc.on('uploadMusic', function(event, name, base64string) {
    if(name !== undefined && name.indexOf('.mp3') > -1) {
      base64string = base64string.replace('data:audio/mp3;base64,', '');
      var content = new Buffer(base64string, 'base64');

      fs.writeFile(__dirname + '/app/music/' + name, content, function(err) {
        if(err) console.log(err);

        event.sender.send('musicUploaded', name);
      });
    }
  });
};