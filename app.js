/* global require, __dirname, console */

var app = require('app');
var menu = require('menu');
var BrowserWindow = require('browser-window');
var ipcGetPlayList = require('./ipcHelpers').getPlayList;
var delMusic = require('./ipcHelpers').delMusic;
var uploadMusic = require('./ipcHelpers').uploadMusic;

var mainWindow = null;

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    height: 500,
    width: 1200
  });

  mainWindow.loadUrl('file://' + __dirname + '/app/index.html');
  ipcGetPlayList();
  delMusic();

  menu.setApplicationMenu(menu.buildFromTemplate([
    {
    label: 'File',
    submenu: [{
      label: 'Developer Tools',
      click: function() {
        mainWindow.openDevTools();
      },
      accelerator: 'CmdOrCtrl+d',
    },
    {
      label: 'Audio Player',
      click: function() {
        mainWindow.loadUrl('file://' + __dirname + '/app/index.html');
        ipcGetPlayList();
        delMusic();
      }
    },
    {
      label: 'Upload',
      click: function() {
        mainWindow.loadUrl('file://' + __dirname + '/app/upload.html');
        uploadMusic();
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