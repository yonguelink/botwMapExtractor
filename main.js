"use strict";

let fs = require('fs-extra'),
    request = require('request'),
    gm = require('gm'),
    async = require('async'),
    folder = "./zelda",
    base = "http://www.zeldadungeon.net/Zelda16/Map/5/",
    format = ".png",
    allColumns = [];

/*
 base = "http://oyster.ignimgs.com/ignmedia/wikimaps/the-legend-of-zelda-breath-of-the-wild/hyrule-botw/6/",
 format = ".jpg";

 base = "http://www.zeldadungeon.net/Zelda16/Map/5/",
 format = ".png";
 */

let download = function(uri, filename, callback){
    request.get(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
};

let getHeaders = function(uri, callback){
    request.head(uri, function(err, res){
        callback(err === null && res !== null && res.statusCode === 200);
    });
};

let prepareFolder = function(cb){
    fs.emptyDir(folder, cb);
};

let verifyAndDownload = function(name, callback){
    let url = base + name + format;
    getHeaders(url, (success)=>{
        if(success){
            download(url, folder + "/" + name + format, ()=>{
                callback(true);
            });
        }else{
            callback(false);
        }
    });
};

let completedY = function(x, cb){
    verifyAndDownload(++x + "-" + 0, (success)=>{
        if(!success)return cb(x);
        console.log("Downloaded : ", x + "-" + 0);
        doY(x, 1, cb);
    });
};

let doY = function(x, y, cb){
    let name = x + "-" + y;
    verifyAndDownload(name, (success)=>{
        if(!success)return completedY(x, cb);
        console.log("Downloaded : ", name);
        doY(x, ++y, cb);
    });
};

let mergeToColumns = function(x, y, max, leftRight, out, cb){
    gm(folder + "/" + x + "-" + 0 + format).append(folder + "/" + x + "-" + y + format, leftRight).write(out, (err, result)=>{
        if(err)
            return cb(err);
        if(y === max -1){
            return cb(++x, out)
        }
        ++y;
        return mergeToColumns(x, y, max, leftRight, out, cb);
    });
};

let mergeTwoColumns = function(columns, i, max, cb, callback){
    gm(folder + "/0-0" + format).append(columns[i], true).write(folder + "/0-0" + format, (err, result)=>{
        if(err)
            throw err;
        console.log("Done merging column :" , i);
        cb(columns, ++i, max, callback);
    });
};

let mergeAll = function(x, max, callback){
    let y = 1;
    mergeToColumns(x, y, max, false, folder + "/" + x + "-" + 0 + format, (z, column)=>{
        console.log("Done with column : ", z-1);
        allColumns.push(column);
        if(z === max){
            return mergeColumns(allColumns, 0, max, callback);
        }
        mergeAll(z, max, callback);
    });
};

let mergeColumns = function(columns, i, max, callback){
    if(i === max)
        return callback();
    mergeTwoColumns(columns, i, max, mergeColumns, callback);
};

prepareFolder(()=>{
    let x = 0, y = 0;
    doY(x, y, (z)=>{
        mergeAll(0, z, ()=>{
            console.log("Done");
        });
    });
});

