module.exports = function(grunt) {
  // 1. All configuration goes here
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    convertJSON: {
      src: 'json/',
      dest: 'js/tmp/shortcuts.js'
    },

    // Configuration for concatenating files goes here
    concat: {
      dist: {
        src: [
          'js/helpers.js',
          'js/keyboard.js',
          'js/tmp/shortcuts',
          'js/script.js'
        ],
        dest: 'js/build/production.js'
      }
    },

    uglify: {
      build: {
        src: 'js/build/production.js',
        dest: 'js/build/product.min.js'
      }
    }
  });

  // 3. Where we tell Grunt we plan to use this plug-in.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  // 4. Where we tell grunt what to do when we type "grunt" into the terminal
  grunt.registerTask("convertJSON", "Convert json files to javascript", function(){
    var src = grunt.config('convertJSON.src'),
        dest = grunt.config('convertJSON.dest'),
        paths = grunt.file.expand(src+'*.json'),

        body = paths.map(function(path){
          return grunt.file.read(path);
        }).join(",");

        grunt.file.write(dest, "var SHORTCUTS = ["+body+"];");
  });

  // Tasks with the alias 'default' get run
  grunt.registerTask('default', ['convertJSON','concat','uglify']);
}
