"use strict";
define(["jquery","shortid","model/CanvasModel","model/CodeModel","view/ToolView","view/CanvasView","view/CodeView","model/Event","text!../exampleScripts/mouseEvents.js", "text!../exampleScripts/simplePath.js"], 

	function($,shortid, CanvasModel,CodeModel,ToolView, CanvasView,CodeView, Event, mouseEvents,simplePath) {

		class Main {
			constructor() {

			}

			static initialize() {
				var canvasModel = new CanvasModel();
				var canvasView = new CanvasView({
					el:$("#canvas"),
					model: canvasModel
				});

				var codeModel = new CodeModel({
					scope: canvasModel.scope
				});


				var toolView = new ToolView({
					el:$(".tools"),
					model: codeModel
				});


				var geometryCodeView = new CodeView({
					el:$("#geometryEditor"),
					model: codeModel,
					script:simplePath,
					sourceName:"geom",
					sourceId: shortid.gen(),
					rank:0
				});

				codeModel.addListener(Event.GEOM_CREATED,geometryCodeView, geometryCodeView.onDMCodeAdded);
				codeModel.addListener(Event.GEOM_MODIFIED,geometryCodeView, geometryCodeView.onDMCodeChanged);

				var eventCodeView = new CodeView({
					el:$("#eventEditor"),
					model: codeModel,
					script:mouseEvents,
					sourceName:"events",
					sourceId: shortid.gen(),
					rank:1
				});

				var logicCodeView = new CodeView({
					el:$("#logicEditor"),
					model: codeModel,
					sourceName:"logic",
					sourceId: shortid.gen(),
					rank:2
				});
		

			}


		}


		return Main;

	});