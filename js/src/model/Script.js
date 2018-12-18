"use strict";

define([],

	function(){
	
		class Script{
			
			constructor(params){
				this.sourceName = params.sourceName;
				this.sourceId = params.sourceId;
				this.sourceCode = params.sourceCode;
				this.breakpoints = params.breakpoints;
				this.rank = params.rank;
			}
		}	
	
		return Script;

	});