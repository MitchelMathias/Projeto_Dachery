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
                    dest: 'dev/estilos',
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
                    { match: 'adicionar', replacement: 'scripts/adicionar_editar_excluir.js' }
                ]
                },
                files:[{
                    expand:true,
                    flatten:true,
                    src:['src/**/*.html'],
                    dest: 'dev/'
                }]
            },
        },
        imagemin:{
            dynamic:{
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
            }
        },
        watch:{
            dev:{
                files:['src/estilos/**/*scss', 'src/**/*.html', 'src/scripts/**/*.js'],
                tasks:['sass:dev', 'replace:dev','copy:dev']
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
}