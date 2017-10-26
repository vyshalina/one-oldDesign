var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	spritesmith = require('gulp.spritesmith'),
	concat = require('gulp-concat'),
	uncss = require('gulp-uncss'),
	cssmin = require('gulp-cssmin'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	rigger = require('gulp-rigger'),
	merge = require('merge-stream'),
	buffer = require('vinyl-buffer');
	babel = require('gulp-babel');

// browser
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: 'dist'
		}
	});
});

// sass
gulp.task('sass', function () {
	return gulp.src('app/css/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
		cascade: false
	}))
	.pipe(gulp.dest('dist/web/css'))
	.pipe(browserSync.reload({stream: true}));
});

// min css
// gulp.task('css:min', function () {
// 	return gulp.src('dist/web/main.css')
// 	pipe(uncss({
// 		html: ['dist/*.html']
// 	}))
// 	.pipe(cssmin())
// 	.pipe(rename({suffix: '.min'}))
// 	.pipe(gulp.dest('dist/web/css'))
// 	.pipe(browserSync.reload({stream: true}));
// });

// libs js
gulp.task('js:libs', function () {
	gulp.src([
		'bower_components/jquery/dist/jquery.min.js',
		'node_modules/jquery-mousewheel/jquery.mousewheel.js',
		'node_modules/owl.carousel/dist/owl.carousel.min.js',
		'node_modules/select2/dist/js/select2.min.js',
		'node_modules/dropzone/dist/dropzone.js',
		'bower_components/smooth-scrollbar/dist/smooth-scrollbar.js',
		'node_modules/lity/dist/lity.min.js',
		'node_modules/jquery-touchswipe/jquery.touchSwipe.min.js',
		'plugins/bpopup/jquery.bpopup.min.js'
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/web/js/'));
});

// main js
gulp.task('js:main', function () {
	gulp.src('app/js/*.js')
	.pipe(babel({
		presets: ["es2015"]
	}))
	.pipe(gulp.dest('dist/web/js/'))
	.pipe(browserSync.reload({stream:true}));
});

// sprite
gulp.task('sprite', function () {
	var spriteData = gulp.src('app/img/icons/*.png').pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.css',
		imgPath: '../img/sprite.png'
	}));

	// sprite image
	var imgStream = spriteData.img
	.pipe(buffer())
	// .pipe(imagemin())
	.pipe(gulp.dest('dist/web/img'));

	// sprite css
	var cssStream = spriteData.css
	.pipe(gulp.dest('app/css'));

	return merge(imgStream, cssStream)
	.pipe(browserSync.reload({stream:true}));
});

// html builder
gulp.task('html:build', function () {
	gulp.src('app/views/**/*.html')
	.pipe(rigger())
	.pipe(gulp.dest('dist/views'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['html:build', 'js:libs', 'js:main', 'sprite', 'browser-sync','sass', /*'css:min'*/], function () {
	gulp.watch('app/**/*.scss', ['sass'/*, 'css:min'*/]);
	gulp.watch('app/**/*.html', ['html:build']);
	gulp.watch('app/img/icons/*.png', ['sprite', 'sass']);
	gulp.watch('app/js/*.js', ['js:main']);
});
