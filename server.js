var fs     = require('fs');
var Ftp    = require('ftp');

//加载配置文件
var loadConfig = function() {
    window.config = require('./config').conf;
}();

//加载本地图片
var getFileList = function() {
    fs.readdir(window.config.picPath, function(err, files) {
        if (err) return;
        window.files = files.filter(function(f) {
            if (f.substr(-4) === '.jpg') return f;
        });
    });
};
getFileList();
setInterval(function() {
    getFileList();
}, 5000);

//获取版本号
window.currVersion = require('./package.json').version;

//自动下载新照片
var lastDownload = new Date();
var downloadPhoto = function() {
    var ftpPath = window.config.ftpPath;
    var picPath = window.config.picPath;
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
                        fs.stat(picPath + file.name, function(err, fileStat) {
                            console.log(fileStat.size + ' ' + file.size);
                            if(err || fileStat.size !== file.size) {return;}
                            console.log('Del');
                            client.delete(ftpPath + file.name, function(err) {
                                console.log('Delete: ' + file.name);
                                client.end();
                            });
                        });
                    });
                    stream.pipe(fs.createWriteStream(picPath + file.name));
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