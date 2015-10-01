var fs     = require('fs');
var Ftp    = require('ftp');
var md5    = require('MD5');
var nhs    = require('node-http-server');

//加载配置文件
var loadConfig = function() {
    window.userConfig = require('./config').conf;
}();

//加载本地图片
var getFileList = function() {
    fs.readdir(window.userConfig.picPath, function(err, files) {
        if (err) return;
        window.files = files.filter(function(f) {
            if (f.substr(-4).toLowerCase() === '.jpg') return f;
        });
    });
};
getFileList();
setInterval(function() {
    getFileList();
}, 5000);

//加载音乐文件
fs.readdir(window.userConfig.musicPath, function(err, music) {
    if (err) return;
    window.music = music.filter(function(e) {
        return e.substr(-4).toLowerCase() === '.ogg';
    });
    nhs.deploy(
    {
        verbose:true,
        port: 22501,
        root: window.userConfig.musicPath
    }
    );
});

//获取版本号
window.currVersion = require('./package.json').version;

//自动下载新照片
var lastDownloadPhotos = new Date();
var downloadPhotoBusy = false;
var downloadPhoto = function() {
    console.log('Down');
    downloadPhotoBusy = true;
    var timer = setTimeout(function() {
        downloadPhotoBusy = false;
        console.log('downloadPhoto fail');
    }, 5 * 60 * 1000);
    var ftpPath = window.userConfig.ftpPath;
    var picPath = window.userConfig.picPath;
    var tempPath = window.userConfig.tempPath;
    lastDownloadPhotos = new Date();
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
            console.log(files);
            var filter = files.filter(function(f) {
                if(f.name.substr(-4) === '.jpg' || f.name.substr(-4) === '.JPG') return f;
            });
            if(filter.length === 0) return;
            filter = [filter[0]];
            
            var timer = setTimeout(function() {
                downloadPhotoBusy = false;
                console.log('downloadPhoto fail');
                client.end();
            }, 60 * 1000);
            filter.forEach(function(file) {
                client.get(ftpPath + file.name, function(err, stream) {
                    if(err) return;
                    console.log('get ' + file.name);
                    stream.once('close', function() {
                        fs.stat(tempPath + file.name, function(err, fileStat) {
                            if(err || fileStat.size !== file.size) {console.log('file size unfix');return;}
                            fs.readFile(tempPath + file.name, function(err, buf) {
                                if(err) return;
                                var newFileName = md5(buf) + '.jpg';
                                fs.rename(tempPath + file.name, picPath + newFileName, function(err) {
                                    if(err) return;
                                    client.delete(ftpPath + file.name, function(err) {
                                        console.log('downloadPhoto success' + file.name);
                                        client.end();
                                        downloadPhotoBusy = false;
                                        clearTimeout(timer);
                                    });
                                });
                            });                           
                        });
                    });
                    stream.pipe(fs.createWriteStream(tempPath + file.name));
                });
            });
        });
    });
};
// downloadPhoto();
setInterval(function() {
    if(downloadPhotoBusy === false) {
    // if(new Date() - lastDownloadPhotos > 90 * 1000 && downloadPhotoBusy === false) {
        downloadPhoto();
    }
}, 5000);