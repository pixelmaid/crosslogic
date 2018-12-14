"use strict";

define(["jquery",
	"codemirror",
	"jshint",
	"view/ViewBase",
	"codemirror/mode/javascript/javascript", 
	"codemirror/addon/lint/lint","codemirror/addon/lint/javascript-lint"
],

function($,CodeMirror, jshint, ViewBase){
	
	class CodeView extends ViewBase {

		constructor(params){
			window.JSHINT = jshint;

			super(params);

			this.codeMirror = CodeMirror(this.el[0], {
				mode: "javascript",
				lineNumbers: true,
				matchBrackets: true,
				tabSize: 4,
				indentUnit: 4,
				indentWithTabs: true,
				tabMode: "shift",
				lint: true
			});

			this.codeMirror.on("change", function() {
				this.onCodeChange();
			}.bind(this));
		}

		
		onCodeChange(){
			var code = this.codeMirror.getValue();
			this.model.updateCode(code);
		}

	}	
	
	return CodeView;

});