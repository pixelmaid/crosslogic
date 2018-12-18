"use strict";

define(["jquery", "paper","mootools","shortid", "eventEmitter", "model/Script","model/Event"],

	function($, paper, mootools, shortid, EventEmitter, Script, Event) {

		class CodeModel extends EventEmitter {

			constructor(params)  {
				super();
				this.scope = params.scope;
				this.slots = {};
				this.paths = [];
				this.targetPath = null
			}

			createGeometryCode(){
				var path = new this.scope.Path();
				path.strokeColor = "black";

				var data = {
					id:"path_"+shortid.gen(),
					segments:[],
					strokeColor:path.strokeColor.toString(),
					fillColor:"null",
					closed:path.closed.toString(),
					startLine: null,
					endLine: null,
				};

				
				this.paths.push(data);
				this.targetPath = data.id
				this.emitEvent(Event.GEOM_CREATED,[data]);
				return path;
			}

			addSegment(id,point){
				var path
				let revisedPaths = this.paths.map(function(obj){
					if (obj.id === id){
						obj.segments.push([point.x,point.y]);
						path = obj;
					}
					return obj;
				});

				this.paths = revisedPaths;
				this.emitEvent(Event.GEOM_MODIFIED,[path]);
			}


			updateCode(slots, params) {
				slots[params.sourceId] = new Script({
					sourceId: params.sourceId,
					sourceName: params.sourceName,
					rank: params.rank,
					sourceCode: params.sourceCode,
					breakpoints: params.breakpoints
				});
			}

			setLinesFor(id,startLine,endLine){
				let revisedPaths = this.paths.map(function(obj){
					if (obj.id === id){
						obj.startLine = startLine;
						obj.endLine = endLine;
					}
					return obj;
				});

				this.paths = revisedPaths;
			};

			compileCode(slots) {

				var mappedHash = Object.keys(slots).sort(function(a, b) {
					return slots[a].rank - slots[b].rank;
				}).map(function(sortedKey) {
					return slots[sortedKey];
				});

				var assembledSouceCode = mappedHash.map(function(script) {
					return script.sourceCode;
				}).join("\n");

				var assembledScript = new Script({
					sourceId: 0,
					sourceName: "assembledScript",
					sourceCode: assembledSouceCode,
					breakpoints: []
				});

				return assembledScript;

			}

			parseInclude(script, scope) {
				var includes = [];
				// Parse code for includes, and load them synchronously, if present
				script.sourceCode.replace(
					/(?:^|[\n\r])include\(['"]([^)]*)['"]\)/g,
					function(all, url) {
						includes.push(url);
					}
				);

				// Install empty include() function, so code can execute include()
				// statements, which we process separately above.
				scope.include = function(url) {};
				var self = this;

				// Load all includes sequentially, and finally evaluate code, since
				// the code will probably be interdependent.
				function load() {
					var path = includes.shift();
					if (path) {
						var url = /^\/lib\//.test(path) ? path.substring(1) : path;
						// Switch to the editor console globally so loaded libraries use
						// our own console too:
						window.console = self.scope.console;

						$.getScript(url, load).fail(function(xhr, error) {
							self.scope.console.error("Cannot load " + path + ": " + error);
						});
					} else {
						self.evaluateCode(script,scope);
					}
				}

				load();
			}


			evaluateCode(script, scope) {
				// Create an array of indices for breakpoints and pass it on.
				var url = script.name + "_" + this.getTimeStamp() + ".js";
				var code = this.preprocessCode(script.sourceCode, script.breakpoints);

				scope.execute(code, {
					url: url,
					source: script.sourceCode,
					sourceMaps: "inline"
				});
			}


			preprocessCode(code, breakpoints) {
				breakpoints = breakpoints.slice(); // Clone since it'll be modified.
				var insertions = [];

				function getOffset(offset) {
					for (var i = 0, l = insertions.length; i < l; i++) {
						var insertion = insertions[i];
						if (insertion[0] >= offset)
							break;
						offset += insertion[1];
					}
					return offset;
				}

				function getCode(node) {
					return code.substring(getOffset(node.range[0]),
						getOffset(node.range[1]));
				}

				function replaceCode(node, str) {
					var start = getOffset(node.range[0]),
						end = getOffset(node.range[1]),
						insert = 0;
					for (var i = insertions.length - 1; i >= 0; i--) {
						if (start > insertions[i][0]) {
							insert = i + 1;
							break;
						}
					}
					insertions.splice(insert, 0, [start, str.length - end + start]);
					code = code.substring(0, start) + str + code.substring(end);
				}

				// Recursively walks the AST and replaces the code of certain nodes
				function walkAST(node, parent) {
					if (!node)
						return;
					var type = node.type,
						loc = node.loc;
					// if (node.range) {
					// 	var part = getCode(node);
					// 	if (part && part.length > 20)
					// 		part = part.substr(0, 10) + '...' + part.substr(-10);
					// 	console.log(type, part);
					// }

					// The easiest way to walk through the whole AST is to simply loop
					// over each property of the node and filter out fields we don't
					// need to consider...
					for (var key in node) {
						if (key === "range" || key === "loc")
							continue;
						var value = node[key];
						if (Array.isArray(value)) {
							for (var i = 0, l = value.length; i < l; i++)
								walkAST(value[i], node);
						} else if (value && typeof value === "object") {
							// We cannot use Base.isPlainObject() for these since
							// Acorn.js uses its own internal prototypes now.
							walkAST(value, node);
						}
					}
					// See if a breakpoint is to be placed in the range of this
					// node, and if the node type supports it.
					if (breakpoints.length > 0 && loc
						// Filter the type of nodes that support setting breakpoints.
						&&
						/^(ForStatement|VariableDeclaration|ExpressionStatement|ReturnStatement)$/.test(type)
						// Filter out variable definitions inside ForStatement.
						&&
						parent.type !== "ForStatement") {
						var start = loc.start.line - 1,
							end = loc.end.line - 1;
						for (var j = 0, l2 = breakpoints.length; j < l2; j++) {
							var line = breakpoints[i];
							if (line >= start && line <= end) {
								replaceCode(node, "debugger; " + getCode(node));
								breakpoints.splice(j, 1);
								break;
							}
						}
					}
				}

				walkAST(paper.PaperScript.parse(code, {
					ranges: true,
					locations: true,
					sourceType: "module"
				}));

				if (breakpoints.length > 0) {
					var lines = code.split(/\r\n|\n|\r/mg);
					for (var i = 0; i < breakpoints.length; i++) {
						var line = breakpoints[i],
							str = lines[line];
						if (!/\bdebugger;\b/.test(str))
							lines[line] = "debugger; " + str;
					}
					code = lines.join("\n");
				}

				return code;
			}



			getTimeStamp() {
				var parts = new Date().toJSON().toString().replace(/[-:]/g, "").match(
					/^20(.*)T(.*)\.\d*Z$/);
				return parts[1] + "_" + parts[2];
			}

		}

		return CodeModel;

	});