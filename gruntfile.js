module.exports = function (grunt) {
    var baseDir = 'src/',
        jsDir = 'js/',
        cssDir = 'css/',
        imgDir = 'imgs/',
        libDir = 'libs/',
        pageDir = 'pages/',
        buildDir = 'build/';


    // LiveReload的默认端口号，你也可以改成你想要的端口号
    var lrPort = 35729;
    var serverPort = 8080;

    // 使用connect-livereload模块，生成一个与LiveReload脚本
    // <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
    var lrSnippet = require('connect-livereload')({
        port: lrPort
    });

    // 使用 middleWare(中间件)，就必须关闭 LiveReload 的浏览器插件
    var middleWares = function (connect, options) {

        return [
            // 把脚本，注入到静态文件中
            lrSnippet,
            // 静态文件服务器的路径
            connect.static(String(options.base)),
            // 启用目录浏览(相当于IIS中的目录浏览)
            connect.directory(String(options.base))
        ];
    };

    // 项目配置
    //noinspection JSUnresolvedFunction
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: baseDir + jsDir,
                        src: '**/*.js',
                        dest: buildDir + jsDir,
                        ext: '.js'
                    }
                ],
                options: {
                    ASCIIOnly: true
                }
            }
        },


        copy: {
            images: {
                expand: true,
                cwd: baseDir + imgDir,
                src: '*',
                dest: buildDir + imgDir,
                flatten: true,
                filter: 'isFile'
            },
            libs: {
                expand: true,
                cwd: baseDir + libDir,
                src: '*',
                dest: buildDir + libDir,
                flatten: true,
                filter: 'isFile'
            }
        },

        compass: {
            dev: {
                options: {
                    config: 'config.rb'
                }
            },
            // 用于 build 时强制 compile，避免合并后不更新
            dev2: {
                options: {
                    config: 'config.rb',
                    force: true
                }
            },
            production: {
                options: {
                    config: 'config_production.rb',
                    force: true
                }
            }
        }, // compass

        // for livereload
        connect: {
            options: {
                // 服务器端口号
                port: serverPort,
                hostname: 'localhost',
                base: '.'
            },
            livereload: {
                options: {
                    // 通过LiveReload脚本，让页面重新加载。
                    middleware: middleWares
                }
            }
        },
        // 监控文件变化, 然后 打包/刷新浏览器
        watch: {
            html: {
                files: [baseDir + pageDir + '*.html']
            },
            compass: {
                files: [baseDir + 'sass/**/*.scss'],
                tasks: ['compass:dev']
            },
            javascript: {
                files: [baseDir + jsDir + '*.js']
                // tasks: ['newer:jshint']
            },
            livereload: {
                // 我们不需要配置额外的任务，watch任务已经内建LiveReload浏览器刷新的代码片段。
                options: {
                    livereload: lrPort
                },
                // '**' 表示包含所有的子目录
                // '*' 表示包含所有的文件
                files: [baseDir + pageDir + '**/*.html', baseDir + cssDir + '**/*', baseDir + jsDir + '**/*']
            }
        },

        jshint: {
            // define the files to lint
            files: ['gruntfile.js', 'src/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                globals: {
                    //大括号包裹
                    curly: true,
                    //对于简单类型，使用===和!==，而不是==和!=
                    eqeqeq: true,
                    //对于属性使用aaa.bbb而不是aaa['bbb']
                    sub: true,
                    //查找所有未定义变量
                    undef: true,
                    //查找类似与if(a = 0)这样的代码
                    boss: true,
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        }
    });

    // 加载提供任务的插件
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // dev
    grunt.registerTask('dev', ['compass:dev', 'uglify', 'copy']);

    // build
    grunt.registerTask('build', ['compass:dev2', 'compass:production', 'uglify', 'copy']);
    //默认任务为Build
    grunt.registerTask('default', ['build']);
    // livereload, 监控文件修改, 然后刷新浏览器
    grunt.registerTask('live', ['connect', 'watch']);
};
