module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    test: {
      files: ['test/**/*.js']
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
        node: true
      },
      globals: {
        exports: true
      },
      all: '<%= lint.files %>'
    }
  });

  // Default task.
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('default', ['lint','test']);
};