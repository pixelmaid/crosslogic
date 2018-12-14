"use strict";

define(["jquery",
	"paper",
	"view/ViewBase"
],

function($,paper,ViewBase){
	
	class CanvasView extends ViewBase {

		constructor(params){
			super(params);
			this.model.scope.setup(this.el[0]);

			$(document).bind("keydown", this.canvasKeydown);
			$(document).bind("keyup", this.canvasKeyup);
		}


		canvasKeydown() {

		}

		canvasKeyup() {
			
		}

	}	
	
	return CanvasView;

});