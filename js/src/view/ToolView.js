//ToolView.js

"use strict";

define(["jquery",
	"paper",
	"view/ViewBase",
	
],

function($, paper, ViewBase) {
	var hitTolerance = 4;

	class ToolView extends ViewBase {


		constructor(params) {
			super(params);
			this._prevSelection = null;
			this._createInspector(this.model.scope,this._prevSelection);
			this._createPenTool(this.model);

			this._setupTools(this.model.scope,this.el);
		}



		_setupTools(scope,el){
			var activeClass = ($(".tool.active", el).attr("class") || "").replace(/\b(button|tool|active)\b/g, "").trim();
			var tools = scope.tools;
			var activeTool = tools[0];

			$(".tool", el).remove();
			for (var i = tools.length - 1; i >= 0; i--) {
				// Use an iteration closure so we have private variables.
				(function(tool) {
					var title = tool.buttonTitle || "",
						button = $("<a class=\"button tool\">" + title + "</a>")
							.prependTo(el),
						buttonClass = tool.buttonClass || "icon-pencil";
					button.addClass(buttonClass);
					button.click(function() {
						tool.activate();
					}).mousedown(function() {
						return false;
					});
					tool.on({
						activate: function() {
							button.addClass("active");
						},
						deactivate: function() {
							button.removeClass("active");
						}
					});
					if (activeClass && buttonClass === activeClass) {
						activeTool = tool;
						activeClass = null;
					}
				})(tools[i]);
			}
			if (activeTool)
				activeTool.activate();

		}

		_createPenTool(model){
			var path = null;

			var penTool = new paper.Tool({
				buttonClass: "icon-vector-pencil"
			}).on({
				mousedown: function(event) {
					//TODO: handle pen down on existing path- add point
					
					/*var result = scope.project.hitTest(event.point, {
						tolerance: hitTolerance,
						segments: true
					});

					var selection = result && result.item;
					if (selection) {
						
					}*/

					if(!path){
						path =  model.createGeometryCode();
					}
					path.add(event.point);
					model.addSegment(model.targetPath,event.point);
				},

				deactivate: function() {
					path = null;
				}
			});
			return penTool;

		}


		_createInspector(scope,prevSelection){
			prevSelection = null;

			function deselect() {
				if (prevSelection) {
					// prevSelection can be an Item or a Segment
					var item = prevSelection.path || prevSelection;
					item.bounds.selected = false;
					item.selected = false;
					prevSelection.selected = false;
					prevSelection = null;
				}
			}

			var inspectorTool = new paper.Tool({
				buttonClass: "icon-cursor"
			}).on({
				mousedown: function(event) {
					deselect();
					var result = scope.project.hitTest(event.point, {
						tolerance: hitTolerance,
						fill: true,
						stroke: true,
						segments: true
					});
					var selection = result && result.item;
					if (selection) {
						var handle = result.type === "segment";
						selection.bounds.selected = !handle;
						if (handle)
							selection = result.segment;
						selection.selected = true;
					}
					/*inspectorInfo.toggleClass("hidden", !selection);
					inspectorInfo.html("");*/
					if (selection) {
						var text;
						if (selection instanceof paper.Segment) {
							text = "Segment";
							text += "<br>point: " + selection.point;
							if (!selection.handleIn.isZero())
								text += "<br>handleIn: " + selection.handleIn;
							if (!selection.handleOut.isZero())
								text += "<br>handleOut: " + selection.handleOut;
						} else {
							text = selection.constructor.name;
							text += "<br>position: " + selection.position;
							text += "<br>bounds: " + selection.bounds;
						}
						console.log(text);
						//inspectorInfo.html(text);
					}
					prevSelection = selection;
				},

				deactivate: function() {
					deselect();
					prevSelection = null;
					//inspectorInfo.addClass("hidden");
					//inspectorInfo.html("");
				}
			});
			return inspectorTool;

		}


	}
	return ToolView;
});