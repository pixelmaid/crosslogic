var path;

var textItem = new PointText(new Point(20, 30));
textItem.fillColor = 'black';
textItem.content = '';

function onMouseDown(event) {
	// If we produced a path before, deselect it:
	if (path) {
		path.selected = false;
	}

	path = new Path();
	path.strokeColor = 'black';
	
	// Select the path, so we can see its segment points:
	path.fullySelected = true;
}

function onMouseDrag(event) {
	// Every drag event, add a point to the path at the current
	// position of the mouse:
	path.add(event.point);
	
	textItem.content = 'Segment count: ' + path.segments.length;
	
	
}

function onMouseUp(event) {
	var segmentCount = path.segments.length;
	
	// When the mouse is released, simplify it:
	path.simplify(5);
	
	// Select the path, so we can see its segments:
	
	var newSegmentCount = path.segments.length;
	textItem.content = "segment num:"+newSegmentCount;
	
	for(var i=0;i<4;i++){
    	replicate(path);
	}
		//path.fullySelected = true;

}

function replicate(path){

    var segments = path.segments.map(
            function(segment,i,array){
                if(i>0 && i<array.length-1){
                console.log(i);

                var randomX = Math.random()*20-10;   
                var randomY = Math.random()*20-10;
                var rPoint = new Point(randomX,randomY);
              
                return new Segment(segment.point+rPoint,segment.handleIn, segment.handleOut);
                }
                else{
                    return segment.clone();
                }
            }
        )
    
    var nPath = new Path(segments);
    nPath.strokeColor = 'red';
}