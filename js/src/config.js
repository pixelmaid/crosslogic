require.config({
	baseUrl : "js/src",

	paths : {
		"text": "../../bower_components/text/text",
		"jquery" : "../../bower_components/jquery/dist/jquery",
		"handlebars"  : "../../bower_components/handlebars/handlebars.amd",
		"hbs": "../../bower_components/hbs/hbs",
		"paper" : "../../bower_components/paper/dist/paper-full",
		"jquery-ui" : "../../bower_components/jqueryui/jquery-ui",
		"jshint": "../../bower_components/jshint/dist/jshint",
		"lodash": "../../bower_components/lodash/lodash",
		"shortid": "../../bower_components/shortid/dist/js-shortid",
		"eventEmitter": "../../bower_components/eventEmitter/EventEmitter",
		"mootools": "../../bower_components/mootools/dist/mootools-core"

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
	},
	
	hbs: {
		helpers: true,
		helperDirectory : "../templates/helpers/",
		templateExtension: "hbs", // default: 'hbs'
		partialsUrl: ""           // default: ''
	}
});
