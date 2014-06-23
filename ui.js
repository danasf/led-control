/*
*  LED Simulator, User Interface 
*  events, methods for handling user interface 
*/
;(function(exports) {

	// add handlers for UI
	exports.addHandlers = function() {
		$("#cols").on("blur",function(evt) {
			if(typeof parseInt($(this).val(),10) === 'number') {
				cols = $(this).val();
				console.log(cols,rows);
				makeLeds(cols,rows);
			}
		});

		$("#rows").on("blur",function(evt) {
			if(typeof parseInt($(this).val(),10) === 'number') {
				rows = $(this).val();
				console.log(cols,rows);
				makeLeds(cols,rows);
			}
		});

		$("#btn").on("click",function() {
			console.log("I clicked on the random button");
				randomFillAll(function(pixels) {
					for(var i =0; i < pixels.length; i++) {
					}
					socket.emit('pixels', { pix: pixels });

				});
		});

		$("#off").on("click",function() {
			window.clearInterval(anim);
			socket.emit('off');
		});

		$("#party").on("click",function() {
			setInterval(function() {
				randomFillAll(function(pixels) {
					for(var i =0; i < pixels.length; i++) {
						console.log('Send To:',i,pixels[i]);
					}
					socket.emit('pixels', { pix: pixels });

				});

			},1000);
		});

		
		$(".slider").slider({
			min:0,
			max:100,
			step: 1,
			value: 100,
			slide: function(evt,ui) {
				console.log(ui.value);
			}
		});

	}


})(this);