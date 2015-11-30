
var gulp = require("gulp"),
    concat = require("gulp-concat"),
    livereload = require("gulp-livereload"),
    sourcemaps = require("gulp-sourcemaps"),
    sequence = require("gulp-sequence"),
    serv = require("./serv");

var paths = {
    src: "src/",
    build: "build/",
    www: "www/",
    css: "css/",
    lib: "lib/"
};

// need list of sources to enforce app.js
// appearing at the end
// TODO - use module loader or something
var src = [
    paths.src + "catcard.js",
    paths.src + "app.js",
];


gulp.task("default", function(callback){
    sequence("build", "copy", "reload")(callback);
});

gulp.task("build", ["concatJS", "concatCSS"]);

gulp.task("concatJS", function(){
    return gulp.src(src)
        .pipe(sourcemaps.init())
            .pipe(concat("app.js"))
        .pipe(sourcemaps.write("./", { sourceRoot: "src" }))
        .pipe(gulp.dest(paths.build));
});
gulp.task("concatCSS", function(){
    return gulp.src(paths.css + "**/*.css")
        .pipe(concat("app.css"))
        .pipe(gulp.dest(paths.build));
});


gulp.task("copy", function(callback){
    sequence(["copyBuild", "copyIndex", "copyLib"])(callback);
});

gulp.task("copyBuild", function(){
    return gulp.src(paths.build + "**/*")
        .pipe(gulp.dest(paths.www));
});
gulp.task("copyIndex", function(){
    return gulp.src("index.html")
        .pipe(gulp.dest(paths.www));
});
gulp.task("copyLib", function(){
    return gulp.src(paths.lib + "**/*")
        .pipe(gulp.dest(paths.www));
});

gulp.task("reload", function(){
    livereload.reload();
});

gulp.task("watch", function(){
    livereload.listen();

    gulp.watch(paths.src + "**/*.js", ["default"]);
    gulp.watch(paths.css + "**/*.css", ["default"]);
    gulp.watch("index.html", ["default"]);

    serv(paths.www);
});
