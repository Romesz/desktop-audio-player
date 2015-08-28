/* global require, __dirname, console */

var app = require('app');
var menu = require('menu');
var BrowserWindow = require('browser-window');
var ipcGetPlayList = require('./ipcGetPlayList').getPlayList;

var mainWindow = null;

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    height: 300,
    width: 500
  });

  mainWindow.loadUrl('file://' + __dirname + '/app/index.html');
  ipcGetPlayList();

  menu.setApplicationMenu(menu.buildFromTemplate([
    {
    label: 'File',
    submenu: [{
      label: 'Developer Tools',
      click: function() {
        mainWindow.openDevTools();
      }
    },
    {
      label: 'Main Menu',
      click: function() {
        mainWindow.loadUrl('file://' + __dirname + '/app/index.html');
        ipcGetPlayList();
      }
    },
    {
      label: 'About',
      click: function() {
        mainWindow.loadUrl('file://' + __dirname + '/app/about.html');
      }
    },
    {
      label: 'Quit',
      click: function(){
        app.quit();
      }
    }]
  }])); // Custom menu creation
});