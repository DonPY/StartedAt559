// Variables for referencing the canvas and 2dcanvas context
var script_version = "2020APR12e"
var canvas,ctx;

// Variables to keep track of the mouse position and left-button status
var mouseX,mouseY,mouseDown=0;

var dot_size = 5;
var grid_x_size = 20;
var grid_y_size = 16;
var grid_data = [];

function displayColor() { 
	var ele = document.getElementsByName('color_select'); 
	  
	var return_color = "Black";  
	  
	for(i = 0; i < ele.length; i++) { 
		if(ele[i].checked) {
			return_color = ele[i].value
			document.getElementById("color_picked").innerHTML
				= return_color; 
		}
	} 
	
	return return_color;
} 

// Draws a dot at a specific position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawDot(ctx,x,y,size) {
	var color = displayColor();
	var color_number = 0;
	var x_grid, y_grid;
	
	//document.getElementById("text_out").value = color;
	
    // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
    r=25; g=25; b=25; a=255;
	
	if ("Green" == color) {
		r=0; g=255; b=0; a=255;
		color_number = 1;
	} else if ("Blue" == color) {
		r=0; g=0; b=255; a=255;
		color_number = 2;
	} else if ( "Red" == color) {
		r=255; g=0; b=0; a=255;
		color_number = 3;
	} else if ( "Purple" == color) {
		r=255; g=0; b=255; a=255;
		color_number = 4;
	} else if ( "White" == color) {
		r=255; g=255; b=255; a=255;
		color_number = 5;
	} else if ( "Yellow" == color) {
		r=0; g=255; b=255; a=255;
		color_number = 6;
	} else if ( "Puke" == color) {
		r=255; g=255; b=0; a=255;
		color_number = 7;
	} else if ( "Black" == color) {
		r=0; g=0; b=0; a=255;
		color_number = 0;
	}

    // Select a fill style
    ctx.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";

    x = x - x % 10 +5;
    y = y - y % 10 +5;

    // Draw a filled circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();

	x_grid = parseInt (x / 10);
	y_grid = parseInt (y / 10);

	document.getElementById("text_out").value = 
		"grid:"+String(x_grid)+","+String(y_grid)+"="+String(color_number);

	grid_data[x_grid+y_grid*grid_x_size] =color_number;
}

// Clear the canvas context using the canvas width and height
function clearCanvas(canvas) {
	var x = 0;
	var y = 0;
	
	ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Add behind elements.
	ctx.globalCompositeOperation = 'destination-over'
	// Now draw!
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ctx.globalCompositeOperation = 'source-over';

	for(x=0;x<grid_x_size;x++) {
		for(y=0;y<grid_y_size;y++) {
			grid_data[x+y*grid_x_size] =0;
		}
	}
	
}

function generate() {
	
	document.getElementById("text_out").value = "Here";
	
	var out_text = "const char foreground_frames[][16][20] PROGMEM = {\r\n//0\r\n    {\r\n";
		
	var ele = document.getElementById("text_out") ;
	
	ele.value = "Here2";
	
	//grid_data[x_grid,x_grid]
	for(y=0;y<grid_y_size;y++) {
		out_text += "        {";
		for(x=0;x<grid_x_size;x++) {
			out_text += String(grid_data[x+y*grid_x_size]);
			//out_text += "{"+String(x)+","+String(y)+"}";
			if(x<grid_x_size-1) {
				out_text += ", ";
			}
		}
		if(y<grid_y_size-1) {
			out_text += "},\r\n";
		} else {
			out_text += "}\r\n";
		}
		
	}
	//out_text += "    }\r\n};\r\n";
	out_text += "    }\r\n};\r\n";

	ele.value = out_text;
}


// Keep track of the mouse button being pressed and draw a dot at current location
function sketchpad_mouseDown() {
    mouseDown=1;
    drawDot(ctx,mouseX,mouseY,dot_size);
}

// Keep track of the mouse button being released
function sketchpad_mouseUp() {
    mouseDown=0;
}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function sketchpad_mouseMove(e) {
    // Update the mouse co-ordinates when moved
    getMousePos(e);

    // Draw a dot if the mouse button is currently being pressed
    if (mouseDown==1) {
        drawDot(ctx,mouseX,mouseY,dot_size);
    }
}

// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
    if (!e)
        var e = event;

    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
 }


// Set-up the canvas and add our event handlers after the page has loaded
function init() {
	document.getElementById("script_version").innerHTML
		+= script_version; 

    // Get the specific canvas element from the HTML document
    canvas = document.getElementById('sketchpad');
	
	clearCanvas(canvas);

    // If the browser supports the canvas tag, get the 2d drawing context for this canvas
    //if (canvas.getContext) {
    //}

    // Check that we have a valid context to draw on/with before adding event handlers
    if (ctx) {
        canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
        canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
        window.addEventListener('mouseup', sketchpad_mouseUp, false);
    }
}
