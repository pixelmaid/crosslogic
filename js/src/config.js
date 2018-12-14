require.config({
	baseUrl : "js/src",

	paths : {
		"text": "../../bower_components/text/text",
		"jquery" : "../../bower_components/jquery/dist/jquery",
		"handlebars"  : "../../bower_components/handlebars/handlebars.amd",
		"paper" : "../../bower_components/paper/dist/paper-full",
		"jquery-ui" : "../../bower_components/jqueryui/jquery-ui",
		"jshint": "../../bower_components/jshint/dist/jshint",
		"lodash": "../../bower_components/lodash/lodash"


	},

	packages : [{
		name: "codemirror",
		location: "../../bower_components/codemirror/",
		main: "lib/codemirror"

	}],

	shim: {
		lodash: {
			exports: "_"
		},
		jshint: {
			deps: ["lodash"],
			exports: "JSHINT"
		}
	}
});
