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
      }
    },
    "babel": {
      options: {
        plugins: ["transform-react-jsx"],
        presets: ["react"]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'source/js/components/',
          src: ['*.jsx.js'],
          dest: 'build/js/components', // Custom folder
          ext: '.js'
        }]
      }
    }
  });
  grunt.registerTask("default", ["clean", "copy", "babel"]);
  //grunt.registerTask("debug", ["clean", "copy", "babel"]);
};
