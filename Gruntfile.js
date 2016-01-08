module.exports = function(grunt) {

    exec = require('child_process').exec;

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            templates: {
                files: 'assets/templates/**/*.html',
                tasks: ['ngtemplates', 'browserify', 'exec:reload']
            },
            js: {
                files: 'assets/js/modules/**/*.js',
                tasks: ['browserify', 'exec:reload']
            }
        },

        ngtemplates: {
            build: {
                options: {
                    base: 'assets/templates',
                    prepend: '',
                    module: 'YourApp'
                },
                src: ['assets/templates/**/*.html'],
                dest: 'assets/templates/templates.js'
            }
        },

        browserify: {
            'assets/js/build/main.js': ['assets/js/modules/main.js'],
            options: {
                debug: true
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            lib: {
                src: [
                    'assets/js/lib/jquery.js',
                    'assets/js/lib/angular.js',
                    'assets/js/lib/angular-sanitize.js',
                    'assets/js/lib/angular-route.js',
                    'assets/js/lib/moment-range.js'
                ],
                dest: 'assets/js/build/lib.js'
            }
        },

        reload: {
            port: 443,
            proxy: {
                host: 'localhost',
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: false
            },
            app: {
                options: {
                    mangle: false,
                    define: {
                        DEBUG: false
                    }
                },
                files: {
                    'assets/js/build/main.min.js': ['assets/js/build/main.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-reload');

    // Default task(s)
    grunt.registerTask('default', []);
    grunt.registerTask('build', ['ngtemplates', 'browserify', 'concat', 'uglify']);

};
