var config = require('./config').conf;
var fs = require('fs');
var Ftp = require('ftp');
var getFileList = function() {
    fs.readdir('/Users/Public/pic/large', function(err, files) {
        if (err) return;
        console.log(files);
        window.files = files.filter(function(f) {
            if (f.substr(-4) === '.jpg') return f;
        });
    });
};
getFileList();
setInterval(function() {
    getFileList();
}, 5000);

var pkg = require('./package.json');
window.currVersion = pkg.version;

var lastDownload = new Date();
var downloadPhoto = function() {
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
            console.log(files);
            var filter = files.filter(function(f) {
                if(f.name.substr(-4) === '.jpg') return f;
            });
            if(filter.length === 0) return;
            filter.forEach(function(file) {
                client.get(ftpPath + file.name, function(err, stream) {
                    if(err) return;
                    console.log('Download: ' + file.name);
                    stream.once('close', function() {
                        fs.stat(localPath + 'pic/large/' + file.name, function(err, fileStat) {
                            console.log(fileStat.size + ' ' + file.size);
                            if(err || fileStat.size !== file.size) {return;}
                            console.log('Del');
                            client.delete(ftpPath + file.name, function(err) {
                                console.log('Delete: ' + file.name);
                                client.end();
                            });
                        });
                    });
                    stream.pipe(fs.createWriteStream(localPath + 'pic/large/' + file.name));
                });
            });
        });
    });
};

downloadPhoto();
setInterval(function() {
    if(new Date() - lastDownload > 180000) {
        downloadPhoto();
    }
}, 5000);