declare var require, Buffer;

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-dotify-json';

export = function(options: any) {

  // Convert standard JSON object to dot notation JSON object

  function dotify(obj:Object): Object {
    let f:Object = {};
    function recurse(o:Object, parent:string): void {
      for (let key in o) {
        let v = o[key];
        let k = (parent ? parent + '.' + key : key);
        if (v && typeof v === 'object') {
          recurse(v, k);
        } else {
          f[k] = v;
        }
      }
    }

    recurse(obj, null);
    return f;
  }

  // Process files

  function process(file, encoding, callback) {

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return callback(null, file);
    }

    let original = require(file.path);

    if(!original || typeof original !== 'object') {
      return callback(null, file);
    }

    let dotted = dotify(original);
    let str = '';
    try {
      str = JSON.stringify(dotted) + '\n'
    } catch (err) {
      return callback(null, file);
    }

    file.contents = new Buffer(str);
    file.path = gutil.replaceExtension(file.path, '.json');

    return callback(null, file);

  }

  return through.obj(process);

}
