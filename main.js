/**
 * Main
 */

var ircLog      = './COSCUP-2012-Day2-IRC.log';
var timer       = 500;  // timer starts
var interval    = 1000; // interval btween timer slots
var intervalMin = 200;  // minimal interval to next message

var fs = require('fs');
var sprintf = require('sprintf').sprintf;
var $ = require('jquery');

fs.readFile(ircLog, 'utf8', function(err, data) {
	
	if (err)
		return console.log(err);
	
	var rundown = { };
	
	var pattern = '([0-9][0-9]:[0-9][0-9]) < ([^\n]+)';
	var regex = new RegExp(pattern);
	var regexG = new RegExp(pattern, 'g');
	var lines = data.match(regexG);
	
	for (var i = 0; i < lines.length; i ++) {
		
		var fields = lines[i].match(regex);
		var timestamp = fields[1];
		var message = fields[2];
		
		if (typeof rundown[timestamp] != 'object') {
			rundown[timestamp] = [ ];
		}
		rundown[timestamp].push(message);
	}
	
	var intervalNext = interval; // interval to next timer slot
	var play = function() {
		
		var second = timer % 60;
		var minute = parseInt(timer / 60);
		var timestamp = sprintf('%02d:%02d', minute, second);
		var slot = rundown[timestamp];
		
		if ($.isArray(slot) && slot.length > 0) {
			
			console.log('[' + timestamp + '] ' + slot.pop());
			
			// consum intervalNext
			var min = intervalMin;
			delta = intervalNext - min;
			intervalNext = (delta < min) ? min : delta;
			
			setTimeout(function() { play(); }, min);
			
		} else {
			
			if (intervalNext >= interval)
				console.log('[' + timestamp + ']');
			timer++;
			setTimeout(function() { play(); }, intervalNext);
			intervalNext = interval;
		}
		
	};
	setTimeout(function() { play(); }, intervalMin);
});

