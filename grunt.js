module.exports = function(grunt) {

  grunt.initConfig({

    less: {
      dist: {
        paths: ['less'],
        files: { 'css/jquery.tiles.min.css': 'less/*.less' },
        options: { yuicompress: true }
      }
    },

    min: {
      dist:{
        src: ['js/*.js'],
        dest: 'js/min/jquery.tiles.min.js'
      }
    },

    compress: {
      zip: {
        files: {
          'zip/jquery.tiles.zip': [
            'css/jquery.tiles.min.css',
            'js/min/jquery.tiles.min.js'
          ]
        }
      },
      options: { flatten: true }
    },

    watch: {
      files: ['**'],
      tasks: 'default'
    }

  })

  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-compress')

  grunt.registerTask('default', 'less min compress')

}
