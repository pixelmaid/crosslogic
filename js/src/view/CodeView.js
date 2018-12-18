"use strict";

define(["jquery",
	"codemirror",
	"jshint",
	"handlebars",
	"view/ViewBase",
	"hbs!../../templates/path",
	"codemirror/mode/javascript/javascript",
	"codemirror/addon/lint/lint", "codemirror/addon/lint/javascript-lint"
],

function($, CodeMirror, jshint, handlebars, ViewBase, PathTemplate) {

	class CodeView extends ViewBase {

		constructor(params) {
			window.JSHINT = jshint;

			super(params);

			var text = (params.hasOwnProperty("script")) ? params.script : "";
			var rank = params.rank;
			var sourceName = params.sourceName;
			var sourceId = params.sourceId;

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
				this.onCodeChange(rank,sourceName,sourceId);
			}.bind(this));

			this.codeMirror.setValue(text);

		}


		onCodeChange(rank,sourceName,sourceId) {
			var sourceCode = this.codeMirror.getValue();
			this.model.updateCode(this.model.slots, {
				sourceCode: sourceCode,
				sourceId: sourceId,
				sourceName: sourceName,
				rank: rank,
				breakpoints: []
			});

			var assembledScript = this.model.compileCode(this.model.slots);
			this.model.parseInclude(assembledScript, this.model.scope);
		}

		onDMCodeAdded(data){
			var pathCode = PathTemplate(data);
			var existingCode = this.codeMirror.getValue();
			var startLine = this.codeMirror.lastLine() + 2;

			var newCode = existingCode+"\n\n"+pathCode;

			this.codeMirror.setValue(newCode);
			var endLine = this.codeMirror.lastLine();

			this.model.setLinesFor(data.id,startLine,endLine);
		}

		onDMCodeChanged(data){
			var pathCode = PathTemplate(data);
			var startLine = data.startLine;
			var endLine = data.endLine;
			console.log("start line, end line",startLine,endLine);
			this.codeMirror.setSelection({line:startLine,ch:0},{line:endLine,ch:3});
			this.codeMirror.replaceSelection(pathCode);

		}

	}

	return CodeView;

});