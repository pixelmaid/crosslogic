"use strict";

define([],

	function(){
	
		class ViewBase {

			constructor(params){
				this.el = params.el;
				this.model = params.model;
			}

		}	
	
		return ViewBase;

	});