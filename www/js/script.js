/*
from cordova docs version 1.5.0
<site>/docs/en/1.5.0/phonegap/file/fileentry/fileentry.html

FileEntry
    property
        - isFile // bool: true
        - isDirectory // bool: false
        - name // name excluding path
        - fullPath
    method
        - getMetaData
        - moveTo
        - copyTo
        - toURI
        - remove // delete
        - createWriter // see FileWriter Object
        - file // see File Object
DirectoryEntry
    property
        - isFile // false
        - isDirectory // true
        - name
        - fullPath
    method
        - getMetaData
        - moveTo
        - copyTo
        - toURI
        - remove
        - getParent
        - createReader // see DirectoryReader Object
        - getDirectory
        - getFile
        - removeRecursively
FileWriter
    property
        - readyState
        - fileName
        - length
        - position
        - error
        - onwriteStart
        - onprogress
        - onwrite
        - onabort
        - onerror
        - onwriteend // success | fail
    method
        - abort
        - seek
        - truncate
        - write
File
    property
        - name
        - fullPath
        - type
        - lastModifiedDate
        - size

? Reader ?
*/

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
// move to folder
function fs_dir_move(path, folder_name, to_dir, cb) {
    var sourcePath = cordova.file[path]+folder_name;
    var destionationPath = cordova.file[to_dir];
    window.resolveLocalFileSystemURL(sourcePath, function(directoryEntry) {
        window.resolveLocalFileSystemURL(destionationPath, function(parentEntry) {
            directoryEntry.moveTo(parentEntry, directoryEntry.name, function(result) {
                cb(result);
            }, function(err) { cb(err)} );
        }, function(err) {cb(err)} );
    }, function(err) {cb(err)} );
}
function fs_dir_rename(path, oldFolderPath, newFolderName, success_cb, fail_cb) {
    window.resolveLocalFileSystemURL(cordova.file[path]+oldFolderPath+'/', function(directoryEntry) {
        directoryEntry.getParent(function(parentEntry) {
            // newFolder should not full path
            const newPath = parentEntry.nativeURL+newFolderName;
            directoryEntry.moveTo(parentEntry,newFolderName,function(result) {
                success_cb(result)
            }, function(err) {fail_cb(err)})
        }, function(err) {fail_cb(err.code)});
    }, function(err) { fail_cb(err.code) });
} 
function fs_dir_remove(path, target_folder, cb) {
    window.resolveLocalFileSystemURL(cordova.file[path]+target_folder+'/', function(directoryEntry) {
        directoryEntry.removeRecursively(function(result) {
            cb(result);
        }, function(err) {cb(err)})
    }, function(err) { cb(err)})
}
// file
function fs_file_create(path, file_name, file_content, cb) {
    window.resolveLocalFileSystemURL(cordova.file[path], function(directoryEntry) {
        directoryEntry.getFile(file_name, { create: true, exclusive: true}, function(fileEntry) {
            fileEntry.createWriter(function(writer) {
                writer.onwriterend = function() { cb(true) }
                writer.onerror = function() { cb(false) }
                writer.write(file_content);
            }, function(err) { cb(err) });
            cb(fileEntry.fullPath);
        }, function(err) { cb(err)})
    }, function(err) {cb(err)})
}
function fs_file_read(storage, file_target, cb) {
    window.resolveLocalFileSystemURL(cordova.file[storage]+file_target, function(fileEntry) {
        fileEntry.file(function(file) {
            var reader = new FileReader();
            // reader.onload
            reader.onloadend = function(evt) {
                cb({
                    event: evt,
                    result: this.result
                });
            }
            reader.onerror = function(e) { cb(e) }
            reader.readAsText(file);
        }, function(e) { cb(e) })
    }, function(e) { cb(e) })
}
function fs_file_move(path, file_from, file_to) {
    path = cordova.file[path]+file_from;
    var newName = file_to;
    return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(path, (fs) => {
                fs.getParent((parent) => {
                    fs.moveTo(parent, newName, (entry) => {
                        resolve(entry)
                    }, (err) => {
                        console.error(err)
                        reject(err)
                    })
                }, (err) => {
                    console.error(err)
                    reject(err)
                })
            }, (err) => {
                console.error(err)
                reject(err)
            })
        })
   
}