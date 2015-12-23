# gulp-dotify-json

> Gulp plugin to transform json files into dot notation json files

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-dotify-json`

## Usage

```javascript
var dotify = require('gulp-dotify-json');

gulp.task('dotify-locales', function() {
  return gulp.src('./app/locales/*.json')
    .pipe(dotify())
    .pipe(gulp.dest('./dist/locales'));
});
```

## Options

Coming soon!