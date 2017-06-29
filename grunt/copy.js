'use strict';
/**
 * Options for the `jshint` grunt task
 *
 * @module grunt/jshint
 */
module.exports = function (grunt) {
  var path = require('path');
  var deps = Object.keys(require('../package.json').dependencies);
  deps = deps.map(function (dep) {
    var pkg = require(path.resolve('node_modules', dep, 'package.json'));
    var index;
    if (pkg.main) {
      index = path.normalize('node_modules/' + '/' + dep + '/' + pkg.main);
    } else {
      console.log('Property `main` does not exist in ' + dep + '\'s package.json');
    }

    return {
      nonull: true,
      src: index,
      dest: path.join('src', 'libs', dep, 'index.js')
    };
  });

  deps.push({
    src: [
      'node_modules/bootstrap-sass/assets/fonts/*',
      'node_modules/bootstrap-sass/assets/stylesheets/*'
    ],
    dest: 'src/libs/bootstrap-sass/',
    expand: true,
    flatten: true
  });


  console.log(deps);


  // return null;
  return {
    libraries: {
      files: deps
      // files: [{
      //     src: 'node_modules/lodash/lodash.js',
      //     dest: 'src/libs/lodash/'
      //   }, {
      //     src: 'node_modules/backbone/'
      //   },
      //
      //
      //
      //
      //   {
      //     src: 'bower_components/lodash/dist/*',
      //     dest: 'src/libs/lodash/',
      //     expand: true,
      //     flatten: true
      //   },
      //   {
      //     src: 'bower_components/marionette/lib/*',
      //     dest: 'src/libs/marionette/',
      //     expand: true,
      //     flatten: true
      //   },
      //   {
      //     src: 'bower_components/backbone.babysitter/lib/*',
      //     dest: 'src/libs/backbone.babysitter/',
      //     expand: true,
      //     flatten: true
      //   },
      //   {
      //     src: [
      //       'bower_components/bootstrap/dist/css/*',
      //       'bower_components/bootstrap/dist/fonts/*',
      //       'bower_components/bootstrap/dist/js/*'
      //     ],
      //     dest: 'src/libs/bootstrap/',
      //     expand: true,
      //     flatten: true
      //   },
      //   {
      //     src: ['bower_components/d3/*.js'],
      //     dest: 'src/libs/d3/',
      //     expand: true,
      //     flatten: true
      //   },
      //   {
      //     src: ['bower_components/requirejs-plugins/src/*.js'],
      //     dest: 'src/libs/requirejs-plugins/',
      //     expand: true,
      //     flatten: true
      //   },
      //
      //   {
      //     src: ['bower_components/fontawesome/scss/*'],
      //     dest: 'src/libs/fontawesome/scss/',
      //     expand: true,
      //     flatten: true
      //   },
      //   {
      //     src: ['bower_components/fontawesome/fonts/*'],
      //     dest: 'src/libs/fontawesome/fonts',
      //     expand: true,
      //     flatten: true
      //   },
      //   {
      //     cwd: 'bower_components/bootstrap-sass/assets/stylesheets/',
      //     src: ['*', '**'],
      //     expand: true
      //   },
      //   {
      //     src: ['bower_components/react/*.js'],
      //     dest: 'src/libs/react/',
      //     expand: true,
      //     flatten: true
      //   },
      //   {
      //     src: ['bower_components/requirejs-babel/*.js'],
      //     dest: 'src/libs/requirejs-babel-plugin/',
      //     expand: true,
      //     flatten: true
      //   },
      //   {
      //     src: ['bower_components/select2/**/*.js', 'bower_components/select2/**/*.css'],
      //     dest: 'src/libs/select2/',
      //     expand: true,
      //     flatten : true
      //   }
      // ]
    },

    release: {
      files: [{
        expand: true,
        src: ['./src/**'],
        dest: 'dist/',
        rename: function(dest, src) {
          return dest + src.replace('/src/', '/');
        }
      }]
    },

    discovery_vars: {
      src: 'src/discovery.vars.js.default',
      dest: 'src/discovery.vars.js',
      filter: function () {
        // Only copy if over if it does not exist
        var dest = grunt.task.current.data.dest;
        return !grunt.file.exists(dest);
      }
    },

    keep_original: {
      files: [{
        expand: true,
        src: [
          './dist/index.html',
          'dist/discovery.config.js'
        ],
        dest: 'dist/',
        rename: function(dest, src) {
          var x = src.split('.');
          return x.slice(0, x.length-1).join('.') + '.original.' + x[x.length-1];
        }
      }]
    },

    foo: {
      files: [{
        src: ['./src/js/components/**/*.js'],
        dest: 'dist/',
        expand: true,
        rename: function(dest, src) {
          return dest + src.replace('/src/', '/');
        }
      }]
    },

    //give the concatenated file a cache busting hash
    bumblebee_app : {
      files : [{
        src: ['dist/bumblebee_app.js'],
        dest: 'dist/',
        expand: true,
        rename : function(dest, src){
          var gitDescribe = grunt.file.read('git-describe').trim();
          // find out what version of bbb we are going to assemble
          var tagInfo = gitDescribe.split('-');
          var version;
          if (tagInfo.length == 1) {
            version = tagInfo[0]; // the latest tag is also the latest commit (we'll use tagname v1.x.x)
          }
          else {
            version = tagInfo[2]; // use commit number instead of a tag
          }
          return 'dist/bumblebee_app.' + version + '.js';
        }

      }]
    }
  };
};
