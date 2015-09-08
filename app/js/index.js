/* global angular, console, window, require, document, FileReader */

window.ipc = require('ipc');

var app = angular.module('andioPlayer', []);

app.controller('andioPlayerCtrl', function($scope, $window) {
  $scope.audioContainer = angular.element(document.querySelector('#audio'))[0];
  $scope.audioPath = 'music/';
  $scope.audioTitle = '';
  $scope.index = 0;
  $scope.noAudioFound = false;

  $scope.playList = [];

  $window.ipc.on('getPlayList', function(playList) {
    $scope.playList = playList;

    if($scope.playList.length > 0) {
      $scope.noAudioFound = false;
    } else {
      $scope.noAudioFound = true;
    }

    $scope.audioContainer.src = $scope.audioPath + playList[0];
    $scope.$apply();
  });
  $window.ipc.send('isServerLive');

  $window.ipc.on('getPlayListAfterDel', function(playList) {
    $scope.playList = playList;
    $scope.noAudioFound = false;

    if($scope.playList.length === 0) {
      console.log('there is no item in the playList');
      $scope.audioContainer.src = '';
      $scope.noAudioFound = true;
      $scope.$apply();
      return;
    }

    if($scope.index >= $scope.playList.length) {
      $scope.index = 0;
    }

    var nextAudio = $scope.playList[$scope.index];

    $scope.audioContainer.src = $scope.audioPath + nextAudio;
    $scope.audioContainer.oncanplay = function() {
      $scope.$apply();
    };
    $scope.$apply();
  });

  $scope.changeAudioSource = function(index, audioTitle) {
    $scope.index = index;
    $scope.audioContainer.pause();

    var src = $scope.audioPath + audioTitle;
    $scope.audioContainer.src = src;

    $scope.audioContainer.oncanplay = function() {
      $scope.audioContainer.play();
      $scope.$apply();
    };
  };

  $scope.delMusic = function(index) {
    $scope.index = index;
    $window.ipc.send('delMusicByIndex', index);
  };

  $scope.audioContainer.onplay = function() {
    $scope.$apply();
  };

  $scope.audioContainer.onpause = function() {
    $scope.$apply();
  };

  $scope.audioContainer.onended = function() {
    $scope.index++;
    if($scope.index >= $scope.playList.length) {
      $scope.index = 0;
    }
    var nextAudio = $scope.playList[$scope.index];

    $scope.audioContainer.src = $scope.audioPath + nextAudio;

    $scope.audioContainer.oncanplay = function() {
      $scope.audioContainer.play();
      $scope.$apply();
    };
    $scope.$apply();
  };
});

app.controller('UploadCtrl', function($scope, $window) {
  $scope.musicUploaded = '';

  $scope.uploadMusic = function(e) {
    e.preventDefault();

    var files = angular.element(document.querySelector('#file'))[0].files;
    if(files.length === 0)
      return;

    for(var i = 0 ; i < files.length ; i++) {
      (function(file) {
        var name = file.name;
        var reader = new FileReader();
        reader.onload = (function(e) {
          $window.ipc.send('uploadMusic', name, e.target.result, files.length);
        });
        reader.readAsDataURL(file);
      })(files[i]); // needs an IIFE function inside the for loop
    }
  };

  $window.ipc.on('musicUploaded', function(name) {
    $scope.musicUploaded = name;
    $scope.$apply();
  });
});