function fs_dir_list(path, cb) {
    window.resolveLocalFileSystemURL(cordova.file[path], function(fileSystem) {
        var reader = fileSystem.createReader();
        reader.readEntries(function(entries) {
            cb(entries);
        }, function(e) {cb(false)});
    }, function(e) {cb(false)});
}
function fs_dir_create(path, name, cb) {
    // PASS 'applicationStorageDirectory'
    // PASS 'externalApplicationStorageDirectory'
    window.resolveLocalFileSystemURL(cordova.file[path], function(dirEntry) {
        dirEntry.getDirectory(name, {
            create: true,
            exclusive: true // fail if exists
        }, function(entry) {
            cb(entry.nativeURL);
        }, function(e) {cb(false)}
    )}, function(e) {cb(false)});
}
function fs_dir_rename(path, name_from, name_to) {
    var old_path = path + name_from+'/';
    return new Promise(function(resolve, reject) {
        window.resolveLocalFileSystemURL(old_path, function(fs) {
            fs.getParent(function(parent) {
                fs.moveTo(parent,name_to, function(entry) {
                    resolve(entry);
                }, function(e) {
                    reject(e)
                }, function(e) {
                    reject(e)
                })
            }, function(e) {
                reject(e)
            });
        })
    })
}
