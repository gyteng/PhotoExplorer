var fs = require('fs');
var gui = require('nw.gui');

//杀死Explorer防止出现Win8的CharmBar
var killExplorer = function() {
    var process = require('child_process');
    process.exec('taskkill \/IM explorer.exe \/F');
}();

//自动更新程序
var lastDownload = new Date();
var isFree = true;
var update = function() {
    var ftpPath = window.userConfig.ftpPath;
    var appPath = window.userConfig.appPath;
    lastDownload = new Date();
    var client = new Ftp();
    client.connect({
        host: window.userConfig.ftpHost, user: window.userConfig.ftpUser, password: window.userConfig.ftpPassword
    });
    client.on('error', function() {console.log('FTP error');});
    client.on('close', function() {console.log('FTP close');});
    client.on('end'  , function() {console.log('FTP end')  ;});
    client.on('ready', function() {
        console.log('FTP ready');
        client.list(ftpPath, function(err, files) {
            if(err || files.length === 0) return;
            var filter = files.filter(function(f) {
                if(f.name === 'PhotoExplorer.nw') return f;
            });
            if(filter.length === 0) return;
            isFree = false;
            filter.forEach(function(file) {
                client.get(ftpPath + file.name, function(err, stream) {
                    if(err) return;
                    stream.once('close', function() {
                        fs.stat(appPath + file.name + '.new', function(err, fileStat) {
                            console.log(fileStat.size + ' ' + file.size);
                            if(err || fileStat.size !== file.size) {return;}
                            fs.rename(appPath + file.name + '.new', appPath + file.name, function(err, data) {
                                if (err) return;
                                client.delete(ftpPath + file.name, function(err) {
                                    client.end();
                                    setTimeout(function() {
                                        process.exec('nw.exe c:\\Users\\Public\\PhotoExplorer.nw');
                                        gui.App.quit();
                                    }, 7000);
                                });
                            });
                        });
                    });
                    stream.pipe(fs.createWriteStream(appPath + file.name + '.new'));
                });
            });
        });
    });
};
update();
setInterval(function() {
    if(new Date() - lastDownload > (3 * 60 * 1000) && isFree) {
        update();
    }
}, 10000);