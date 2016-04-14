import gulp from 'gulp';
import gutil from 'gulp-util';
import webpack from 'webpack';
import webpadMiddleware from 'webpack-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config';
import runSequence from 'run-sequence';
import del from 'del';
import fs from 'fs';
import ncp from 'ncp';


const DEBUG = !process.argv.includes('--release');


gulp.task('clean', () => {
  del(['.tmp', 'build/*', '!build/.git'], {watch: false});
  return fs.makeDir('build/public');
})

gulp.task('copy', () => {

});

gulp.task('start', () => {

});
