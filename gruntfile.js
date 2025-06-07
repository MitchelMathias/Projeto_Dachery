const {option} = require('grunt')

module.exports = (grunt) =>{
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass:{
            dev:{
                files:[{
                    expand: true,
                    cwd: 'src/estilos/scss',
                    src: ['*.scss'],
                    dest: 'dev/estilos',
                    ext: '.css'
                }]
            },
            production:{
                options:{
                    style: 'compressed'
                },
                files:[{
                    expand: true,
                    cwd: 'src/estilos/scss',
                    src: ['*.scss'],
                    dest: 'dist/estilos',
                    ext: '.css'
                }]
            }
        },
        replace:{
            dev:{
                options:{
                    patterns:[
                        { match: 'endereco_css', replacement: 'estilos/main.css' },
                        { match: 'endereco_css2', replacement: 'estilos/pag01.css' },
                        { match: 'adicionar', replacement: 'scripts/adicionar_editar_excluir.js' },
                        { match: 'front_dados', replacement: 'scripts/front_dados.js' },
                        { match: 'fetch', replacement: 'http://localhost:3001'}
                    ]
                },
                files:[{
                    expand:true,
                    flatten:true,
                    src:['src/**/*.html'],
                    dest: 'dev/'
                },
                {
                    expand:true,
                    flatten:true,
                    src:['src/scripts/**/*.js'],
                    dest: 'dev/scripts/'
                }]
            },
            dist:{
                options:{
                    patterns:[
                        { match: 'endereco_css', replacement: 'estilos/main.css' },
                        { match: 'endereco_css2', replacement: 'estilos/pag01.css' },
                        { match: 'adicionar', replacement: 'scripts/adicionar_editar_excluir.js' },
                        { match: 'front_dados', replacement: 'scripts/front_dados.js' },
                        { match: 'fetch', replacement: '' }
                    ]
                },
                files:[{
                    expand:true,
                    flatten:true,
                    src:['src/**/*.html'],
                    dest: 'dist/'
                },
                {
                    expand:true,
                    flatten:true,
                    src:['src/scripts/**/*.js'],
                    dest: 'dist/scripts/'
                }]
            },
        },
        imagemin:{
            dev:{
                options:{
                    optimizationLevel:5,
                    progessive: true,
                    interlaced: true
                },
                files:[{
                    expand:true,
                    cwd: 'src/imagens',
                    src: ['**/*.{png,jpeg,jpg}'],
                    dest: 'dev/imagens'
                }]
            },
            dist:{
                options:{
                    optimizationLevel:5,
                    progessive: true,
                    interlaced: true
                },
                files:[{
                    expand:true,
                    cwd: 'src/imagens',
                    src: ['**/*.{png,jpeg,jpg}'],
                    dest: 'dist/imagens'
                }]
            }
        },
        uglify:{
            build:{
                files:[{
                    expand: true,
                    cwd: 'src/scripts/',
                    src: ['**/*.js'],
                    dest: 'build/scripts/',
                    ext: '.min.js'
                }]
            }
        },
        copy:{
            dev:{
                files:[{
                    expand: true,
                    cwd: 'src/scripts/',
                    src: ['**/*.js'],
                    dest: 'dev/scripts/'
                }]
            },
            dist:{
                files:[{
                    expand: true,
                    cwd: 'src/scripts/',
                    src: ['**/*.js'],
                    dest: 'dist/scripts/'
                }]
            },

        },
        watch:{
            dev:{
                files:['src/estilos/**/*scss', 'src/**/*.html', 'src/scripts/**/*.js'],
                tasks:['sass:dev','copy:dev' ,'replace:dev']
            }
        }
    })
    grunt.loadNpmTasks('grunt-contrib-sass')
    grunt.loadNpmTasks('grunt-replace')
    grunt.loadNpmTasks('grunt-contrib-imagemin')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-contrib-watch')
    
    grunt.registerTask('default', ['watch'])
    grunt.registerTask('build', ['sass:production', 'copy:dist', 'replace:dist'])
    grunt.registerTask('dev', ['sass:dev', 'copy:dev', 'replace:dev'])
}