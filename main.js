const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('splash.html');

  mainWindow.once('ready-to-show', () => {
    // Verificar atualizações depois de criar a janela
    autoUpdater.checkForUpdatesAndNotify();

    // Eventos do autoUpdater
    autoUpdater.on('update-available', () => {
      mainWindow.webContents.executeJavaScript(
        "document.getElementById('loading-text').textContent = 'Baixando atualização...';"
      );
    });

    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Atualização pronta',
        message: 'Uma nova versão está pronta. Reiniciar agora para instalar a atualização.',
        buttons: ['Reiniciar', 'Mais tarde']
      }).then(result => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        } else {
          // Se o usuário escolher atualizar mais tarde, redirecionar para a tela de login
          mainWindow.loadFile('login.html');
        }
      });
    });

    // Se não houver atualização, redirecionar para a tela de login após o tempo de splash screen
    setTimeout(() => {
      mainWindow.loadFile('login.html');
    }, 3200);
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
