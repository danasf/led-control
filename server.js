var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var serPort = require('serialport');

server.listen(8888);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/client.js', function (req, res) {
  res.sendfile(__dirname + '/client.js');
});

app.get('/ui.js', function (req, res) {
  res.sendfile(__dirname + '/ui.js');
});


io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  // on receive pixel array
  socket.on('pixels', function (data) {
    console.log("received pixel array",data);
    for (var i = 0; i < data.pix.length; i++) {
    	var tmp = "HEX " + i + " " + data.pix[i]+"\r";
      ser.write(tmp,function(err,res) { if(err) { console.log("Ser write err %s",err); } console.log(res); });
    };
    ser.write('REFRESH\r');

  });

  // on receive data for single pixel
  socket.on('pixel', function (data) {
    console.log("received single pixel data",data);
    var tmp = "HEX " + data.id + " " + data.fill.replace(/#/gi,'')+"\r";
    ser.write(tmp,function(err,res) { if(err) { console.log("Ser write err %s",err); } console.log(res); });
    ser.write('REFRESH\r');

  });


  socket.on('off', function (data) {
    console.log("led strip off");
    ser.write('OFF\r');
  });

});

// serial port
var ser = new serPort.SerialPort("/dev/null",{ baudrate:57600, parser: serPort.parsers.readline("\n")}, 
	function(err) {
		if(err) { console.log(err); process.exit(); }
  });

ser.on('open', function(error) {
	if(error) {
		console.log(error);
	}
	ser.ACTIVE=true;
	console.log("Serial port is open!");

	ser.on('data', function(data) {
		console.log("From serial: %s",data);
	});
});

ser.on('error', function(error) {
	console.log(error);
});

ser.on('close',function(error) {
	ser.ACTIVE=false;
	console.log("Serial port is closed.");
});