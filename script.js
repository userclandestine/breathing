
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
var SegmentTimer = 0;
var TotalTimer = 0;

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
	currentSegment = -1;
	clearTimeout(SegmentTimer);
	clearTimeout(TotalTimer);

    INHALE_DURATION = parseFloat($('input[name=inhale]').val(), 4);
    INHALE_PAUSE = parseFloat($('input[name=inhalePause]').val(), 0);
    EXHALE_DURATION = parseFloat($('input[name=exhale]').val(), 4);
    EXHALE_PAUSE = parseFloat($('input[name=exhalePause]').val(), 0);
    DURATION = parseFloat($('input[name=duration]').val(), 10);

    segments.push(INHALE_DURATION);
    segments.push(INHALE_PAUSE);
    segments.push(EXHALE_DURATION);
    segments.push(EXHALE_PAUSE);
	startSegment();
	TotalTimer = setTimeout(function() {
		currentSegment = 0;
		clearTimeout(SegmentTimer);
        $(".Completed").empty();
		$(".Completed").append("Breathing Complete!");
    }, DURATION*60*1000); //Timer duration
}

function startSegment() {
	currentSegment++;
	currentSegment = currentSegment % 4;
	
	var currentSound = undefined;
	if (currentSegment == SEGMENT_INHALE && INHALE_DURATION > 0)
	{
		currentSound = "audio/Inhale.mp3";
	}
	else if (currentSegment == SEGMENT_INHALE_PAUSE && INHALE_PAUSE > 0)
	{
		currentSound = "audio/Hold.mp3";
	}
	else if (currentSegment == SEGMENT_EXHALE && EXHALE_DURATION > 0)
	{
		currentSound = "audio/Exhale.mp3";
	}
	else if (currentSegment == SEGMENT_EXHALE_PAUSE && EXHALE_PAUSE > 0)
	{
		currentSound = "audio/Hold.mp3";
	}

	if (currentSound != undefined)
	{
		var audioElem = document.getElementById("audioContainer");
		audioElem.src = currentSound;
		audioElem.currentTime = 0;
		audioElem.load();
		audioElem.play();
	}

	segmentStartTime = undefined;
	SegmentTimer = setTimeout(function() {
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