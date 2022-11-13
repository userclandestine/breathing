
var INHALE_DURATION = 3.5;
var INHALE_PAUSE = 3.5;
var EXHALE_DURATION = 3.5;
var EXHALE_PAUSE = 3.5;
var REPETITIONS = 5;

var SEGMENT_INHALE = 0;
var SEGMENT_INHALE_PAUSE = 1;
var SEGMENT_EXHALE = 2;
var SEGMENT_EXHALE_PAUSE = 3;

var segments = [];
var currentSegment = -1;

var segmentStartTime = 0;
var radius = 1;

var requestAnimationFrame = window.requestAnimationFrame || 
							window.mozRequestAnimationFrame || 
							window.webkitRequestAnimationFrame || 
							window.msRequestAnimationFrame;

$(document).ready(setup);

function setup() {
    $('.start').mousedown(gatherInput);
    drawCircle();
}

function gatherInput() {
    INHALE_DURATION = parseFloat($('input[name=inhale]').val(), 3.5);
    INHALE_PAUSE = parseFloat($('input[name=inhalePause]').val(), 3.5);
    EXHALE_DURATION = parseFloat($('input[name=exhale]').val(), 3.5);
    EXHALE_PAUSE = parseFloat($('input[name=exhalePause]').val(), 3.5);
    REPETITIONS = parseFloat($('input[name=repetitions]').val(), 3);

    segments.push(INHALE_DURATION);
    segments.push(INHALE_PAUSE);
    segments.push(EXHALE_DURATION);
    segments.push(EXHALE_PAUSE);
	startSegment();
}

function startSegment() {
	currentSegment++;
	currentSegment = currentSegment % 4;
	
	if (currentSegment == SEGMENT_INHALE)
	{
		REPETITIONS--;
		if (REPETITIONS == -1)
		{
			return;
		}

		$(".CyclesRemaining").empty();
		$(".CyclesRemaining").append("Cycles Remaining: " + REPETITIONS);
		console.log("Remaining: " + REPETITIONS);
		var SND_INHALE = new Audio("audio/Inhale.mp3"); // buffers automatically when created
		SND_INHALE.play();
	}
	else if (currentSegment == SEGMENT_INHALE_PAUSE)
	{
		// Do nothing
	}
	else if (currentSegment == SEGMENT_EXHALE)
	{
		var SND_EXHALE = new Audio("audio/Exhale.mp3"); // buffers automatically when created
		SND_EXHALE.play();
	}
	else if (currentSegment == SEGMENT_EXHALE_PAUSE)
	{
		// Do nothing
	}

	segmentStartTime = undefined;
	setTimeout(function() {
        startSegment();
    }, segments[currentSegment]*1000); //Timer duration
}

function drawCircle(dt) {
	var mainCanvas = document.getElementById("circleCanvas");
	var mainContext = mainCanvas.getContext("2d");

	var canvasWidth = mainCanvas.width;
	var canvasHeight = mainCanvas.height;


	mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
	
	//bg color
	mainContext.fillStyle = "#FFFFFF";
	mainContext.fillRect(0, 0, canvasWidth, canvasHeight);

	if (segmentStartTime === undefined)
	{
		segmentStartTime = dt;
	}
	var elapsed = dt - segmentStartTime;
	var percentComplete = ((segments[currentSegment]*1000) - elapsed) / (segments[currentSegment]*1000);
	if (currentSegment == SEGMENT_INHALE)
	{
		radius = 50 + 150 * (1 - percentComplete);
	}
	else if (currentSegment == SEGMENT_EXHALE)
	{
		radius = 50 + 150 * percentComplete;
	}
	
	//circle
	mainContext.beginPath();
	mainContext.arc(250, 250, radius, 0, Math.PI * 2, false);
	mainContext.closePath();
	
	//circle color
	mainContext.fillStyle = "#2596be";
	mainContext.fill();
	 
	requestAnimationFrame(drawCircle);
}