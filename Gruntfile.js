/* jshint browser: false, node: true */
"use strict";

module.exports = function (grunt) {

	grunt.initConfig({

		eslint: {
			target: [ "bower.json",
				"package.json",
				"*.js",
				"js/src/**/*.js"
			]
		},

		mocha: {
			all: {
				src: ["tests/testrunner.html"],
			},
			options: {
				run: true,
				growlOnSuccess: false
			}
		},

		clean: ["./build"],
		copy: {
			html: { src: "index-build.html", dest: "build/index.html" },
			images: { expand: true, cwd: "images", src: "**", dest: "build/images/" },
			font: { expand: true, cwd: "font", src: ["**/*.ttf","**/*.eot","**/*.svg","**/*.woff","**/*.woff2"], flatten: true, dest: "build/style/font" }
			/*ui:{
                files: [{ 
                    expand: true, 
                    cwd: "bower_components/jqueryui/themes/base/images", 
                    src: "**", 
                    dest: "build/style/jqueryui/images/"
                }]
            }*/
		},
		cssmin: {
			all: {
				files: [{
					expand: true,
					cwd: "style/",
					src: ["*.css"],
					dest: "build/style/"
				},
				{
					expand: true,
					cwd: "bower_components/codemirror/lib/",
					src: ["*.css"],
					dest: "build/style/codemirror"
				},{
					expand: true,
					cwd: "bower_components/codemirror/addon/lint",
					src: ["*.css"],
					dest: "build/style/codemirror/addon/"
				},
				{
					expand: true,
					flatten: true,
					cwd: "font",
					src: ["**/*.css"],
					dest: "build/style/font"
				}]
			}
		},
		requirejs: {
			compile: {
				options: {
					paths: { "requirejs" : "../../bower_components/requirejs/require" },
					include : ["requirejs", "app"],
					insertRequire : ["uiloader"],
					mainConfigFile: "js/src/config.js",
					baseUrl: "js/src/",
					name: "uiloader",
					out: "build/js/main.js",
					optimize: "none",
					wrapShim: true,
					useStrict: true
				}
			}
		}

	});

	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-mocha");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-requirejs");

	grunt.registerTask("test", ["eslint", "mocha"]);

	grunt.registerTask("build", [
		"test", "clean", "copy", "cssmin", "requirejs"
	]);

	grunt.registerTask("default", ["test"]);

};
