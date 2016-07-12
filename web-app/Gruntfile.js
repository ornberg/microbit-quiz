'use strict';
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.initConfig({
    "clean": {
      all: ['build/**'],
      js: ['build/js/*', '!build/js/all.js', '!build/js/background.js']
    },
    "copy": {
      main: {
        files: [
          // includes files within path
          //{expand: true, src: ['source/*'], dest: 'build/', filter: 'isFile'},

          // includes files within path and its sub-directories
          {expand: true, cwd: 'source/', src: ['**', '!js/components/**'], dest: 'build/'},
        ]
      },
      lib: {
        files: [
          {expand:true, flatten: true,
            src:
                [
                  "node_modules/react/dist/react.js",
                  "node_modules/react-dom/dist/react-dom.js",
                  "node_modules/immutable/dist/immutable.min.js",
                  "node_modules/redux/dist/redux.min.js",
                  "node_modules/chart.js/dist/Chart.min.js"
                ],
            dest: 'build/js/lib/'},
        ]
      },
      pkg: {
        src: ["./package.json"],
        dest: 'build/package.json'
      }
    },
    "babel": {
      options: {
        plugins: ["transform-react-jsx"],
        presets: ["es2015", "react"]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'source/js',
          src: ["**/*.js", '!lib/**'],
          dest: 'build/js',
          ext: '.js'
        }]
      }
    },
    "browserify": {
      js: {
        src: ["build/js/index.js"],
        dest: "build/js/all.js"
      }
    },
    nwjs: {
      options: {
          platforms: ['win64','osx64'],
          macIcns: './source/img/icon-128.icns',
          buildDir: './nwjsBuild',
          cacheDir: './nwjsCache'
      },
      src: ['./build/**/*']
    }
  });
  var tasks = ["clean:all", "copy", "babel", "browserify", "clean:js"];
  grunt.registerTask("default", tasks);
  grunt.registerTask("build-with-nwjs", tasks.concat("nwjs"));
};
