module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-cli');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    mochacli: {
      options: {
          require: ['blanket'],
          reporter: 'spec',
          bail: true
      },
      all: ['test/**/*.js']
    },
    lint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
    },
    watch: {
      scripts: {
        files: '<%= lint.files %>',
        tasks: 'default'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        mocha: true
      },
      globals: {
        exports: true
      },
      all: '<%= lint.files %>'
    }
  });

  // Default task.
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['mochacli']);
  grunt.registerTask('default', ['lint','test']);
};