var $ = document.querySelectorAll.bind(document)

var waveform = 0;
var tempo = 200;
var reverse = false;
var play = true;

var table = $("#table");
var columns = $("#table > colgroup > col");
var rows = $("#table > tbody > tr");

var pointer = 0;

var context = new (window.AudioContext || window.webkitAudioContext)();

var oscillators = new Array(8);

for(var i = 0; i < oscillators.length; i++) {
	oscillators[i] = context.createOscillator();
	oscillators[i].type = "sine";
	oscillators[i].frequency.value = 440 + (i - oscillators.length / 2) * 10;
	//oscillators[i].connect(context.destination);
	oscillators[i].playing = false;
	oscillators[i].start();
}

var Update = function(timestamp) {
	pointer = (pointer + 1) % columns.length;
	
	for(var i = 0; i < columns.length; i++) columns[i].classList.remove("active");
	columns[pointer].classList.add("active");
	
	for(var i = 0; i < rows.length; i++) {
		if(rows[i].children[pointer].children[0].checked) {
			if(!oscillators[i].playing) {
				oscillators[i].connect(context.destination);
				oscillators[i].playing = true;
			}
		} else {
			if(oscillators[i].playing) {
				oscillators[i].disconnect(context.destination);
				oscillators[i].playing = false;
			}
		}
	}
}

var intervalID = setInterval(Update, tempo);
