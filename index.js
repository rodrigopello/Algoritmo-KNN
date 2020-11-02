const { app, BrowserWindow, Menu, ipcMain } = require('electron');

const url = require('url');
const path = require('path');


let mainWindow;

app.on('ready', () => {

  


  // The Main Window
  mainWindow = new BrowserWindow({width: 720, height: 600});

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }))

  // If we close main Window the App quit
  mainWindow.on('closed', () => {
    app.quit();
  });


});

