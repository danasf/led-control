/*
*  LED Simulator
*  events, methods for handling drawing of leds and communication with backend
*/

;(function(exports) {

	// current animation frame
	var frame=0;


	// 
	exports.makeLeds = function(cols,rows) {
		pixels = [];
		circles = [];
		r.clear();
		for(var i=0; i < cols; i++) {
			for(var j=0; j < rows; j++) {
				circle = r.rect((40*j+1),(40*i+1),30,30,4)

				circle.attr("fill","#666");
				circle.attr('stroke',"#666");

				circle.mouseover(function(){
					this.attr("fill",randColor());
					console.log("you clicked on me! Filling with:",this.id,this.attrs.fill);
					socket.emit('pixel', { id: this.id, fill:this.attrs.fill });
				});

				circle.mouseout(function(){
					this.glow().remove();
				});

				circle.randomFill = function() {
					this.attr("fill",randColor());
				}

				circles.push(circle);
			}
		}
	}


	// Fills all LEDs with random color
	exports.randomFillAll = function(callback) {
		var pixels = [];
		for(var i=0; i < circles.length; i++) {
			circles[i].attr("fill",randColor());
		}
		callback(pixels);
	}

	exports.sequentialFill = function(color) {
	var pixels = [];
	// for each frame
		console.log("sequential fill!");
		if(frame < circles.length) {
			circles[frame].attr("fill",color);
		}
		frame++;
		frameCheck();

  }

  exports.sineWave = function() {
  	var pi = 3.1415926
  	var rt = 0.3;
  	//for(var i=0; i < pi*2; i + rt ) {
  		for(var j=0; j < circles.length; j++) {
  			var c = Math.floor(Math.sin(j+(frame*rt)) * 127 + 128);
  			var color = "#"+toHex(c,c,c);
  			//console.log(j,":",color);
  			circles[j].attr("fill",color);
  		}
  		frame++;
		frameCheck();
  	//}
  }


  exports.makeRainbows = function() {
	  	var rt = 0.3;
    	for(var j=0; j < circles.length; j++) {

  			var r = sinColor(j,(frame*rt),0);
  			var g = sinColor(j,(frame*rt),2);
  			var b = sinColor(j,(frame*rt),4);
  			var color = r+","+g+","+b;
  			circles[j].attr("fill","#"+toHex(r,g,b));
  		}
  		frame++;
		frameCheck();
  }

	exports.sendPixels = function () {

	}

	// generates the output in OPC format
	exports.genPixelStream = function(size,pixels) {

		var data = { 
			channel: "00",
			cmd: "00",
			length: size,
			data: pixels
		}
		return data;

	}


	// create a RGB color in hex format
	exports.randColor = function() {
		var color = [];
		function randC() {
			return Math.floor(Math.random()*255);
		}
		//color.push("0000");
		color.push(randC());
		color.push(randC());
		color.push(randC());

		return "#"+toHex(color[0],color[1],color[2]);
	}

	exports.getDataLength = function(size){
		return lpad((size*3).toString(16),4);
	}

	exports.runAnimation = function(callback,delay) {
		var x=0;
		var myEvt = window.setInterval(function() {
			callback();
			if(x > circles.length) {
				window.clearInterval(myEvt);
			}
			x++;

		},delay);
	}



	/**
     * Helper functions
	 **/

	// left pads to specified length
	var lpad = function(str, len) {
		while(str.length < len) {
			str = '0' + str;
		}
		return str;
	}

	// converts hex string to rgb
	var toRGB = function(hex) {
		color = hex.match(/#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i);
		return color;
	}

	// rgb to hex
	var toHex = function(r,g,b) {
		var c = tintColor(r,g,b);
		r = c[0].toString(16);
		g = c[1].toString(16);
		b = c[2].toString(16);
		return lpad(r,2)+lpad(g,2)+lpad(b,2);
	}

	var frameCheck = function() {
		if(circles.length < 100) {
			if(frame > 100) {
				frame=0;
				console.log("Frame Reset to 0");
			}
		}
		else {
			if(frame > circle.length) {
				frame=0;
				console.log("Frame Reset to 0");
			}
		}
	}

	var tintColor = function(r,g,b) {
		var rTint = Math.floor(r*($("#rTint").slider( "value" )/100.0));
		var gTint = Math.floor(g*($("#gTint").slider( "value" )/100.0));
		var bTint = Math.floor(b*($("#bTint").slider( "value" )/100.0));

		return [rTint,gTint,bTint];
	}


	var sinColor = function(i,freq,off) {
		return Math.round(Math.sin(i+freq+ off)* 127 + 128);
	}

	var colorWheel = function(pos) {
		
	  if(pos < 85) {
   		return [pos * 3, 255 - pos * 3, 0];
  	  } else if(pos < 170) {
   		pos -= 85;
   		return [255 - pos * 3, 0, pos * 3];
  	  } else {
   		pos -= 170;
   		return [0, pos * 3, 255 - pos * 3];
  		}

	}


})(this);