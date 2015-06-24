var config = require('./config').conf;
var fs = require('fs');
var gui = require('nw.gui');
var process = require('child_process');
process.exec('taskkill \/IM explorer.exe \/F');

var lastDownload = new Date();
var isFree = true;
var update = function() {
    var ftpPath = './Dropbox/ifttt/';
    var localPath = '/Users/Public/';
    lastDownload = new Date();
    var client = new Ftp();
    client.connect({
        host: config.ftpHost, user: config.ftpUser, password: config.ftpPassword
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
                        fs.stat(localPath + file.name + '.new', function(err, fileStat) {
                            console.log(fileStat.size + ' ' + file.size);
                            if(err || fileStat.size !== file.size) {return;}
                            fs.rename(localPath + file.name + '.new', localPath + file.name, function(err, data) {
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
                    stream.pipe(fs.createWriteStream(localPath + file.name + '.new'));
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