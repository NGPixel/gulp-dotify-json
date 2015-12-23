"use strict";
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'gulp-dotify-json';
module.exports = function (options) {
    function dotify(obj) {
        var f = {};
        function recurse(o, parent) {
            for (var key in o) {
                var v = o[key];
                var k = (parent ? parent + '.' + key : key);
                if (v && typeof v === 'object') {
                    recurse(v, k);
                }
                else {
                    f[k] = v;
                }
            }
        }
        recurse(obj, null);
        return f;
    }
    function process(file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return callback(null, file);
        }
        var original = require(file.path);
        if (!original || typeof original === 'object') {
            return callback(null, file);
        }
        var dotted = dotify(original);
        var str = '';
        try {
            str = JSON.stringify(dotted) + '\n';
        }
        catch (err) {
            return callback(null, file);
        }
        file.contents = str;
        file.path = gutil.replaceExtension(file.path, '.json');
        return callback(null, file);
    }
    return through.obj(process);
};
