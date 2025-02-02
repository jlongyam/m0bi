function fs_dir_list(path, cb) {
    window.resolveLocalFileSystemURL(path, function(fileSystem) {
        var reader = fileSystem.createReader();
        reader.readEntries(function(entries) {
            cb(entries);
        }, function(e) {});
    }, function(e) {});
}
