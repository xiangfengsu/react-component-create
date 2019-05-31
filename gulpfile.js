const through2 = require("through2");
const gulp = require("gulp");

const less = require("less");
const { readFileSync } = require("fs");
const path = require("path");
const postcss = require("postcss");
const NpmImportPlugin = require("less-plugin-npm-import");

const rucksack = require("rucksack-css");
const autoprefixer = require("autoprefixer");

const libDir = 'lib';
const esDir = 'es';

function cssInjection(content) {
  return content
    .replace(/\/style\/?'/g, "/style/css'")
    .replace(/\/style\/?"/g, '/style/css"')
    .replace(/\.less/g, ".css");
}

const postcssConfig = {
  plugins: [
    rucksack(),
    autoprefixer({
      browsers: [
        "last 2 versions",
        "Firefox ESR",
        "> 1%",
        "ie >= 9",
        "iOS >= 8",
        "Android >= 4"
      ]
    })
  ]
};

function transformLess(lessFile, config = {}) {
  const { cwd = process.cwd() } = config;
  const resolvedLessFile = path.resolve(cwd, lessFile);

  let data = readFileSync(resolvedLessFile, "utf-8");
  data = data.replace(/^\uFEFF/, "");

  // Do less compile
  const lessOpts = {
    paths: [path.dirname(resolvedLessFile)],
    filename: resolvedLessFile,
    plugins: [new NpmImportPlugin({ prefix: "~" })],
    javascriptEnabled: true
  };
  return less
    .render(data, lessOpts)
    .then(result =>
      postcss(postcssConfig.plugins).process(result.css, { from: undefined })
    )
    .then(r => r.css);
}

function compile(dir) {
  gulp
    .src([`${dir}/**/*.less`])
    .pipe(
      through2.obj(function(file, encoding, next) {
        this.push(file.clone());
        if (file.path.match(/(\/|\\)style(\/|\\)index\.less$/)) {
          transformLess(file.path)
            .then(css => {
              file.contents = Buffer.from(css);
              console.log();
              file.path = file.path.replace(/\.less$/, ".css");
              this.push(file);
              next();
            })
            .catch(e => {
              console.error(e);
            });
        } else {
          next();
        }
      })
    )
    .pipe(gulp.dest(dir));

  gulp
    .src([`${dir}/**/*.js`])
    .pipe(
      through2.obj(function(file, encoding, next) {
        this.push(file.clone());
        if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
          const content = file.contents.toString(encoding);
          file.contents = Buffer.from(cssInjection(content));
          file.path = file.path.replace(/index\.js/, "css.js");
          this.push(file);
          next();
        } else {
          next();
        }
      })
    )
    .pipe(gulp.dest(dir));
}

gulp.task("compile-style-lib",done =>{
  compile(libDir);
  done();
});
gulp.task("compile-style-es",done =>{
  compile(esDir);
  done();
})

gulp.task("compile-style",gulp.series(gulp.parallel('compile-style-lib','compile-style-es')));


