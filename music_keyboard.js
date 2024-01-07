let keys = [
	{ key:"End",		fq:261.63, 	name:"c4" },
	{ key:"ArrowDown",	fq:277.18, 	name:"c#" },
	{ key:"PageDown",	fq:293.66, 	name:"d4" },
	{ key:"ArrowLeft",	fq:311.13, 	name:"d#" },
	{ key:"Clear",		fq:329.63, 	name:"e4" },
	{ key:"ArrowRight",	fq:349.23, 	name:"f4" },
	{ key:"Home",		fq:369.99, 	name:"f#" },
	{ key:"ArrowUp",	fq:392.00, 	name:"g4" },
	{ key:"PageUp",		fq:415.30, 	name:"g#" },
	{ key:"NumLock",	fq:440.00, 	name:"a4" },
	{ key:"/",			fq:466.16, 	name:"a#" },
	{ key:"*",			fq:493.88, 	name:"b4" },
	{ key:"1",			fq:261.63, 	name:"c4" },
	{ key:"2",			fq:277.18, 	name:"c#" },
	{ key:"3",			fq:293.66, 	name:"d4" },
	{ key:"4",			fq:311.13, 	name:"d#" },
	{ key:"5",			fq:329.63, 	name:"e4" },
	{ key:"6",			fq:349.23, 	name:"f4" },
	{ key:"7",			fq:369.99, 	name:"f#" },
	{ key:"8",			fq:392.00, 	name:"g4" },
	{ key:"9",			fq:415.30, 	name:"g#" }
]

const sounds_count = 20
let sounds = []

const settings = {
	detune: 0,
	delay_count: 750,
	shape1: "triangle",
	shape2: "triangle"
}
settings.detune = document.getElementById("detune-slider").value;
settings.delay_count = document.getElementById("delay-slider").value;

document.addEventListener("keydown", keydown);
document.getElementById("start_button").addEventListener("click", start);
document.getElementById("detune-slider").addEventListener("change", set_detune)
document.getElementById("delay-slider").addEventListener("change", set_delay)
document.getElementById("shape-slider").addEventListener("change", set_shape)


// create web audio api context
const audioCtx = new window.AudioContext();	


function start() {
	console.log("start!!!")
	// create Oscillator node
	for (let i = 0; i < sounds_count; i++) {
		
		const oscillator = new OscillatorNode(audioCtx);
		oscillator.type = settings.shape1;
		oscillator.start();

		const oscillator2 = new OscillatorNode(audioCtx);
		oscillator2.type = settings.shape2;
		oscillator2.start();
		oscillator.detune.value = settings.detune;
		const sound = { type: "simple", osc: oscillator, osc2: oscillator2, is_connected: false }
		sounds[i] = sound
	}
}


function keydown(evt) {

	let sound = null;
	let key = null;

	console.log(evt.key)

	// finds the object of the key that was presssed

	for (let i = 0; i < keys.length; i++) {
		if (keys[i].key === evt.key) {
			key = keys[i];
			break;
		}
	}
	
	if (key === null) {
		return;
	}

	// checks if any of the oscillators are connected

	for (let i = 0; i < sounds.length; i++) {
		if (sounds[i].is_connected === false) {
			sound = sounds[i];
			break;
		}
		
	}

	if (sound === null) {
		return;
	}

	sound.osc.frequency.value = key.fq;
	sound.osc2.frequency.value = key.fq;


	play(sound);

}

function set_detune(evt) {

	let slider_value = evt.currentTarget.value

	settings.detune = slider_value;
	
	for(let sound of sounds) {
		sound.osc2.detune.value = detune;
	}
}

function set_delay(evt) {

	let slider_value = evt.currentTarget.value
	settings.delay_count = slider_value;
}

function set_shape(evt) {

	let slider_value = evt.currentTarget.value

	console.log(slider_value)

	if (slider_value === "1") {
		settings.shape1 = "sine";
	}
	if (slider_value === "2") {
		settings.shape1 = "square";
	}
	if (slider_value === "3") {
		settings.shape1 = "sawtooth";
	}
	if (slider_value === "4") {
		settings.shape1 = "triangle";
	}

	let label = document.getElementById("shape-label");
	label.innerHTML = settings.shape1;

}

function play(sound) {
	
	sound.osc.connect(audioCtx.destination);
	sound.osc2.connect(audioCtx.destination);
	sound.is_connected = true
	window.setTimeout(disconnect, settings.delay_count, sound);

}

function disconnect(sound) {

	sound.osc.disconnect()
	sound.osc2.disconnect()
	sound.is_connected = false;
}
