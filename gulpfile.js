const gulp       = require('gulp');
const concat     = require('gulp-concat');
const git        = require('gulp-git');
const livereload = require('gulp-livereload');
const rename     = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const typescript = require('gulp-typescript');
const tslint     = require('gulp-tslint');
const uglify     = require('gulp-uglify');
const util       = require('gulp-util');
const server     = require( 'gulp-develop-server' );

const tsProject = typescript.createProject('tsconfig.json');
const tsProjectServer = typescript.createProject('./server/tsconfig.json');

gulp.task('lint', () => {
  gulp.src('src/**/*.ts')
    .pipe(tslint({ formatter: "verbose" }))
    .pipe(tslint.report({
      emitError: false
    }));
});

gulp.task('build', ['lint'], () => {
  const tsResult = tsProject.src()
    .pipe(tsProject());

  return tsResult.js
    .pipe(gulp.dest('.build'));
});

gulp.task('server:lint', () => {
  gulp.src('server/src/**/*.ts')
    .pipe(tslint({ 
      formatter: 'verbose',
      configuration: {
        quotemark: false
      }
    }))
    .pipe(tslint.report({
      emitError: false
    }));
});


gulp.task('server:build', ['server:lint'], () => {
  const tsResultServer = tsProjectServer.src()
    .pipe(tsProjectServer());

  return tsResultServer.js
    .pipe(gulp.dest('server/build'));
});

gulp.task('bundle', ['build'], () => {
  return gulp.src([
    'node_modules/phaser-ce/build/phaser.js',
    '.build/**/!(app).js',
    '.build/app.js'
  ])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(process.env.LIVERELOAD != '0' ? livereload() : util.noop());
});

gulp.task('compress', ['bundle'], () => {
  return gulp.src('public/js/bundle.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task( 'server:start', ['server:build'], function() {
    server.listen( { path: './server/build/index.js' } );
});

gulp.task( 'server:restart', ['server:build'], function() {
    gulp.src(['./server/src/*.ts']).pipe(server());
});

gulp.task('watch', ['bundle', 'server:start'], () => {
  if (process.env.LIVERELOAD != '0') livereload.listen();
  gulp.watch(['src/**/*.ts', 'tsconfig.json'], ['bundle']);
  gulp.watch([ './server/src/*.ts'], ['server:restart'] );
});

gulp.task('deploy', ['compress'], () => {
  git.push('heroku', 'master', (err) => { if (err) throw err; });
});

gulp.task('default', ['bundle']);
