var $ = document.querySelectorAll.bind(document)

var waveform = 0;
var tempo = $("#tempo")[0].value;
var reverse = $("#reverse")[0].checked;
var play = $("#play")[0].checked;

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
	oscillators[i].playing = false;
	oscillators[i].gain = context.createGain();
	oscillators[i].gain.gain.value = 0.0001;
	oscillators[i].connect(oscillators[i].gain);
	oscillators[i].gain.connect(context.destination);
	oscillators[i].start();
}

var Update = function(timestamp) {
	if(!play) return;

	pointer = (pointer + (reverse ? -1 : 1) + columns.length) % columns.length;
	
	for(var i = 0; i < columns.length; i++) columns[i].classList.remove("active");
	columns[pointer].classList.add("active");
	
	for(var i = 0; i < rows.length; i++) {
		if(rows[i].children[pointer].children[0].checked) {
			if(!oscillators[i].playing) {
				oscillators[i].gain.gain.exponentialRampToValueAtTime(1, context.currentTime + 0.05);
				oscillators[i].playing = true;
			}
		} else {
			if(oscillators[i].playing) {
				oscillators[i].gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.05);
				oscillators[i].playing = false;
			}
		}
	}
}

var intervalID = setInterval(Update, tempo);

$("#reverse")[0].addEventListener("change", e => reverse = e.target.checked);
$("#tempo")[0].addEventListener("change", e => {
	tempo = 60 / e.target.value * 1000;
	clearInterval(intervalID);
	intervalID = setInterval(Update, tempo);
});

$("#play")[0].addEventListener("change", e => play = e.target.checked);
