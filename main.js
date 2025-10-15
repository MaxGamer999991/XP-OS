const electron = require("electron");

function createWindow() {
    const win = new electron.BrowserWindow({
        width: 640,
        height: 480,
    });
    win.loadFile("./index.html");
	win.setMenu(null);
}

electron.app.on("ready", () => {
    createWindow();

    electron.app.on('activate', () => {
        if (electron.BrowserWindow.getAllWindows().length == 0)
            createWindow();
    });
});

electron.app.on('window-all-closed', () => {
    if (process.platform != 'darwin')
        electron.app.quit();
});