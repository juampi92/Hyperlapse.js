module.exports = function(grunt) {

  // Load modules
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-watchify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Configs
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %>\n * (c) <%= pkg.author %> - <%= pkg.homepage %>\n * License: MIT (http://www.opensource.org/licenses/mit-license.php)\n*/\n'
      },
      build: {
        src: 'build/hyperlapse.js',
        dest: 'build/hyperlapse.min.js'
      }
    },

    jshint: {
      options: {
        curly: false, //
        eqeqeq: false, //
        eqnull: true,
        browser: true,
        globals: {}
      },
      all: ['src/**/*.js']
    },

    browserify: {
      dist: {
        files: {
          'build/hyperlapse.js': 'src/Hyperlapse.js'
        },
        options: {}
      }
    },

    watchify: {
      options: {
        // defaults options used in b.bundle(opts) 
        detectGlobals: true,
        insertGlobals: false,
        ignoreMissing: false,
        debug: true,
        standalone: false,
        keepalive: true
      },
      dev: {
        src: './src/Hyperlapse.js',
        dest: 'build/hyperlapse.js'
      }
    },

    copy: {
      buildversion: {
        files: [{
          src: 'build/hyperlapse.js',
          dest: 'build/hyperlapse-<%= pkg.version %>.js'
        }, {
          src: 'build/hyperlapse.min.js',
          dest: 'build/hyperlapse-<%= pkg.version %>.min.js'
        }, ]
      },
    },

    clean: {
      build: ["build", "docs"]
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: 'src/',
          outdir: 'docs/',
          themedir: 'node_modules/yuidoc-bootstrap-theme',
          helpers: ['node_modules/yuidoc-bootstrap-theme/helpers/helpers.js']
        }
      }
    }


  });

  // Register tasks

  grunt.registerTask('build', [
    'jshint:all',
    'clean:build',
    'browserify',
    'uglify',
    'yuidoc:compile',
    'copy:buildversion'
  ]);

  grunt.registerTask('watch', ['watchify:dev']);

};