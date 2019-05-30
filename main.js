const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let win
let experiments
let rules

function main () {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, 'assets/icons/png/64x64.png')
  })
  win.loadFile(path.join(__dirname, 'renderer/index.html'))
  win.maximize()
  win.setMenuBarVisibility(false)
  //win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', main)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    main()
  }
})

ipcMain.on('experiments', (event, title) => {
  if (!experiments) {
    experiments = new BrowserWindow({
      width: 1000,
      height: 600,
      parent: win,
      webPreferences: {
        nodeIntegration: true
      }
    })
    experiments.setTitle(title + ' - ' + 'All historical experiments')
    experiments.on('closed', () => {
      experiments = null
    })
    experiments.loadFile(path.join(__dirname, 'renderer/experiments.html'))
    experiments.setMenuBarVisibility(false)
    //experiments.webContents.openDevTools()
  }
})

ipcMain.on('rules', (event, title) => {
  if (!rules) {
    rules = new BrowserWindow({
      width: 1000,
      height: 600,
      parent: win,
      webPreferences: {
        nodeIntegration: true
      }
    })
    rules.setTitle(title + ' - ' + 'All rules to execute')
    rules.on('closed', () => {
      rules = null
    })
    rules.loadFile(path.join(__dirname, 'renderer/rules.html'))
    rules.setMenuBarVisibility(false)
    rules.webContents.openDevTools()
  }
})