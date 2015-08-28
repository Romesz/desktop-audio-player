/* global angular, console, window, require */

window.ipc = require('ipc');

var app = angular.module('andioPlayer', []);

app.controller('andioPlayerCtrl', function($scope, $window) {
  $scope.playList = [];

  $window.ipc.on('getPlayList', function(playList) {
    $scope.playList = playList;
    $scope.$apply();
  });
  $window.ipc.send('isServerLive');
});