'use strict';
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.initConfig({
    "clean": ['build/**'],
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
    }
  });
  grunt.registerTask("default", ["clean", "copy", "babel"]);
  //grunt.registerTask("debug", ["clean", "copy", "babel"]);
};
