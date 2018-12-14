"use strict";
define(["jquery","model/CanvasModel","model/CodeModel","view/CanvasView","view/CodeView","text!../exampleScripts/mouseEvents.js", "text!../exampleScripts/simplePath.js"], 

	function($,CanvasModel,CodeModel,CanvasView,CodeView, mouseEvents,simplePath) {

		class Main {
			constructor() {

			}

			static initialize() {
				var canvasModel = new CanvasModel();
				var canvasView = new CanvasView({
					el:$("#canvas"),
					model: canvasModel
				});


				var geometryCodeModel = new CodeModel({
					scope: canvasModel.scope
				});
				var geometryCodeView = new CodeView({
					el:$("#geometryEditor"),
					model: geometryCodeModel,
					script:simplePath
				});

				var eventCodeModel = new CodeModel({
					scope: canvasModel.scope
				});
				var eventCodeView = new CodeView({
					el:$("#eventEditor"),
					model: eventCodeModel,
					script:mouseEvents
				});

				var logicCodeModel = new CodeModel({
					scope: canvasModel.scope
				});
				var logicCodeView = new CodeView({
					el:$("#logicEditor"),
					model: logicCodeModel
				});
			
				//bind paper tool events
				/*var tool = new Paper.Tool();
			tool.name = "paperTool";
			tool.attach("mousedown", Main.toolMouseDown);
			tool.attach("mousedrag", Main.toolMouseDrag);
			tool.attach("mouseup", Main.toolMouseUp);
			tool.activate();

			*/

			}



			/*static toolMouseDown(event) {
			console.log("mouseDown");
			if (Main.currentCurve == null) {
				Main.currentCurve = new Paper.Path({
					strokeColor: "black"
				});
			}
			Main.currentCurve.add(event.point);

		}

		static toolMouseUp(event) {
			console.log("mouseUp");

		}

		static toolMouseDrag(event) {
			console.log("mouseDrag");

		}*/




		}
		return Main;

	});