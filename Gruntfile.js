module.exports = function(grunt) {
  // 1. All configuration goes here
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    convertJSON: {
      src: 'src/json/',
      dest: 'tmp/shortcuts.js'
    },

    // Configuration for concatenating files goes here
    concat: {
      dist: {
        src: [
          'src/js/helpers.js',
          'src/js/keyboard.js',
          'tmp/shortcuts.js',
          'src/js/script.js'
        ],
        dest: 'build/production.js'
      }
    },

    uglify: {
      build: {
        src: 'build/production.js',
        dest: 'build/product.min.js'
      }
    },

    jshint: {
      files: ['src/js/*.js'],
      options: {
        force: true,
        globals: {
          console: true,
          JSHelpers: true,
          SHORTCUTS: true,
          keyboard: true,
          htmlKeyboard: true
        }
      }
    },

    sass: {
      dist: {
        options: {
            style: 'compressed',
            noCache: true
        },
        files: {
            'build/main.css': 'src/stylesheets/main.scss'
        }
      }
    },

    watch: {
      options: {
        livereload: true,
      },

      scripts: {
        files: ['src/js/*.js', 'src/json/*.json'],
        tasks: ['jshint','convertJSON', 'concat', 'uglify'],
        option: {spawn: false}
      },

      css: {
        files: ['src/stylesheets/*.scss', 'src/stylesheets/modules/*.scss', 'src/stylesheets/partials/*.scss', 'src/stylesheets/vendor/*.scss'],
        tasks: ['sass'],
        options: {spawn: false}
      }
    }

  });

  // 3. Where we tell Grunt we plan to use this plug-in.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

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
  grunt.registerTask('default', ['jshint','convertJSON','concat','uglify','sass','watch']);
}
