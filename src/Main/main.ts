import { app, BrowserWindow, session } from 'electron'
import path from 'path'

const isDev = process.env.NODE_ENV === 'development'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 450,
    minWidth: 500,
    minHeight: 450,
    transparent: true,
    frame: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // CHANGED: Disable for development to allow Google API
    },
  })

  // Remove CSP entirely for development
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const headers = { ...details.responseHeaders }
    delete headers['content-security-policy']
    delete headers['Content-Security-Policy']
    delete headers['X-Content-Security-Policy']
    
    callback({ responseHeaders: headers })
  })

  // Handle ALL permission requests
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    console.log('🔐 Permission requested:', permission)
    callback(true) // Allow everything in development
  })

  // Handle permission checks
  session.defaultSession.setPermissionCheckHandler(() => true)

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../Interface/index.html'))
  }

  // Detailed network logging
  mainWindow.webContents.session.webRequest.onBeforeRequest((details, callback) => {
    console.log('🌐 Network request:', details.url)
    callback({})
  })

  mainWindow.webContents.session.webRequest.onErrorOccurred((details) => {
    console.error('❌ Network error:', details.url, details.error)
  })

  mainWindow.webContents.session.webRequest.onCompleted((details) => {
    if (details.url.includes('google') || details.url.includes('speech')) {
      console.log('✅ Request completed:', details.url, details.statusCode)
    }
  })
}

app.whenReady().then(() => {
  console.log('🚀 Electron app ready')
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})