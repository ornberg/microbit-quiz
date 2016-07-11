'use strict';
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browserify');
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
          dest: 'build/js', // Custom folder
          ext: '.js'
        }]
      }
    },
    "browserify": {
      js: {
        src: ["build/js/index.js"],
        dest: "build/js/all.js"
      }
    }
  });
  grunt.registerTask("default", ["clean:all", "copy", "babel", "browserify", "clean:js"]);
  //grunt.registerTask("debug", ["clean", "copy", "babel"]);
};
