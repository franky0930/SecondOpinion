var lodash = require('lodash');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    concurrent: {
      devel: {
        tasks: ['connect', 'watch'],
        options: {
          limit: 2,
          logConcurrentOutput: true
        }
      }
    },

    smq: {
      bootstrap: {
        src: "tmp/mobile.css",
        dest: "tmp/sqm",
        basename: "mobile-angular-ui"
      }
    },

    clean: {
      dev: ["tmp", "www/dist", "www/assets/css", 'www/js', 'www/views'],
      cordova: ["app/www"],
      cordovaIndex: ["app/www/index.html"]
    },

    shell: {
      cordova_ios: {
            command: 'cd app && cordova build ios'
        },
      cordova_android: {
            //command: 'cd app && cordova run android'
            command: 'cd app && cordova build android'
        }
    },

    copy: {
      fa: {
        expand: true,
        cwd: "src/font-awesome/fonts",
        src: ["**"],
        dest: 'www/dist/fonts'
      },
      cordova: {
        expand: true,
        cwd: "www",
        src: ["**"],
        dest: 'app/www'
      },
      cordovaIndex: {
        expand: true,
        cwd: "tmp/app",
        src: ["index.html", "js/cordova/cordova-init.min.js"],
        dest: 'app/www'
      }

    },

    less: {
      dist: {
        files: {
          "tmp/mobile.css": "src/less/mobile-angular-ui.less",
          "tmp/sm-grid.css": "src/less/sm-grid.less"
          //"tmp/mobile-angular-ui-desktop.css": "src/less/mobile-angular-ui-desktop.less"
        }
      }
    },

    concat: {
      css: {
        files: {
          "www/dist/css/mobile-angular-ui-base.css": ["tmp/sqm/mobile-angular-ui-base.css", "tmp/sm-grid.css"]
          /*"dist/css/mobile-angular-ui-desktop.css": ["tmp/mobile-angular-ui-desktop.css"],
          "dist/css/mobile-angular-ui-hover.css": ["tmp/hover.css"]*/
        }
      },
      js: {
        files: {
          "www/dist/js/mobile-angular-ui.js": ["src/overthrow/src/overthrow-detect.js", "src/overthrow/src/overthrow-init.js", "src/overthrow/src/overthrow-polyfill.js", "src/fastclick/lib/fastclick.js", "src/js/lib/*.js", "src/js/mobile-angular-ui.js", "node_modules/angular-local-storage/angular-local-storage.min.js"],
          "www/dist/js/angular.1.3.0.bundle.js": ["src/js/angular/angular.1.3.0.js","src/js/angular/angular-animate.1.3.0.js","src/js/angular/angular-aria.1.3.0.js","src/js/angular/angular-sanitize.min.js"],
          //"tmp/js/angular.addons.js": ["src/js/angular/angular-route.1.3.0.min.js","src/js/angular/angular-touch.1.3.0.min.js", "node_modules/ui-router/angular-ui-router.js", "src/js/addons/knob.js", "src/js/addons/standalone-framework.4.0.4.js", "src/js/addons/highcharts.4.0.4.js", "src/js/addons/highcharts-ng.js", "src/js/addons/angular-carousel.js"],
          "tmp/js/angular.addons.js": ["src/js/angular/angular-route.1.3.0.min.js","src/js/angular/angular-touch.1.3.0.min.js", "node_modules/ui-router/angular-ui-router.js", "src/js/addons/knob.js", "src/js/addons/angular-carousel.js"],
          "www/js/app.js": ["src/js/app/routingConfig.js", "src/js/app/app.js","src/js/app/controllers.js","src/js/app/directives.js", "src/js/app/services.js", "src/js/app/filters.js"]
        }
      }
    },

    uglify: {
      minify: {
        options: {
          report: 'min'
        },
        files: {
          "www/dist/js/mobile-angular-ui.min.js": ["www/dist/js/mobile-angular-ui.js"],
          "www/dist/js/angular.1.3.0.bundle.min.js": ["www/dist/js/angular.1.3.0.bundle.js"],
          "www/dist/js/angular.addons.min.js": ["tmp/js/angular.addons.js"],
          "www/js/app.min.js": "www/js/app.js",
          "tmp/app/js/cordova/cordova-init.min.js": "src/js/cordova/cordova-init.js"
        }
      }
    },

    cssmin: {
      minify: {
        options: {
          report: 'min'
        },
        expand: true,
        cwd: 'www/dist/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'www/dist/css/',
        ext: '.min.css'
      }
    },

    htmlmin: {
      htmlmin: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true
        },
        files: [{
            expand: true,
            cwd: 'src/views',
            src: ['**/*.html'],
            dest: 'www/views'
          },{
            'www/index.html': ['src/index.html']
          },{
            'tmp/app/index.html': ['src/app-index.html']
          }]
      }
    },

    watch: {
      all: {
        files: "src/**/*",
        tasks: ["build"]
      }
    },

    connect: {
      server: {
        options: {
          hostname: '127.0.0.1',
          port: 3000,
          base: 'www',
          keepalive: true
        }
      }
    },

    'split-hover': {
      all: {
        src: "tmp/sqm/mobile-angular-ui-base.css",
        dest: "tmp/hover.css"
      }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-concurrent");
  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.task.loadTasks("tasks");

  grunt.registerTask("build", [ "clean:dev",
                                "less",
                                "smq",
                                "split-hover",
                                "concat",
                                "copy:fa",
                                "uglify",
                                "cssmin",
                                'htmlmin']);

  grunt.registerTask("cordova_ios", [ "clean:cordova",
                                  "copy:cordova",
                                  "clean:cordovaIndex",
                                  "copy:cordovaIndex",
                                  "shell:cordova_ios"
                                  ]);
  grunt.registerTask("cordova_android", [ "clean:cordova",
                                  "copy:cordova",
                                  "clean:cordovaIndex",
                                  "copy:cordovaIndex",
                                  "shell:cordova_android"
                                  ]);

  grunt.registerTask("default", [ "build",
                                  "concurrent:devel"]);
};
