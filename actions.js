$(document).ready(function() {

	$.getScript("Chart.js", updateGraph); 

	$('i').click(function(clicked) {
		var dataToAdd = $(clicked.target).attr('id');
		var dataRetrieved = chrome.storage.sync.get('data', function(data) {
    		var graphData = data['data'];
    		var today = new Date();
    		var dd = today.getDate();
    		var mm = today.getMonth()+1; //January is 0!
    		var label = mm + '/' + dd;
    		graphData['rawData'][label] = dataToAdd;
    		graphData['curMode'] = dataToAdd;
    		chrome.storage.sync.set({'data': graphData});
    		$.getScript("Chart.js", updateGraph); 
    	});
	});

	function selectedMode(curMode) {
		if (curMode == "1") {
			$("#1").addClass('chosen');
			$('#1').removeClass('not-chosen');
			$("#2").addClass('not-chosen');
			$('#2').removeClass('chosen');
			$("#3").addClass('not-chosen');
			$('#3').removeClass('chosen');
			$('html').addClass('frown-bg');
			$('html').removeClass('meh-bg');
			$('html').removeClass('happy-bg');
		} else if (curMode == "2") {
			$("#1").addClass('not-chosen');
			$('#1').removeClass('chosen');
			$("#2").addClass('chosen');
			$('#2').removeClass('not-chosen');
			$("#3").addClass('not-chosen');
			$('#3').removeClass('chosen');
			$('html').removeClass('frown-bg');
			$('html').addClass('meh-bg');
			$('html').removeClass('happy-bg');
		} else if (curMode == "3") {
			$("#1").addClass('not-chosen');
			$('#1').removeClass('chosen');
			$("#2").addClass('not-chosen');
			$('#2').removeClass('chosen');
			$("#3").addClass('chosen');
			$('#3').removeClass('not-chosen');
			$('html').removeClass('frown-bg');
			$('html').removeClass('meh-bg');
			$('html').addClass('happy-bg');
		}
	}

	function updateGraph() {
		var Chartjs = Chart.noConflict();
		var ctx = document.getElementById("myGraph").getContext("2d");

		var gradient = ctx.createLinearGradient(0, 0, 0, 400);
    	gradient.addColorStop(0, 'rgba(52, 152, 219, 0.85)');
    	gradient.addColorStop(0.5, 'rgba(52, 152, 219, 0.5)');

    	var dataRetrieved = chrome.storage.sync.get('data', function(data) {
    		var graphData = data['data'];
    		console.log(graphData);
    		graphData['labels'] = [];
    		graphData['datasets'][0]['data'] = [];

    		var rawDataKeys = Object.keys(graphData['rawData']);

    		rawDataKeys.sort(letsSort);

    		for (var i = 0; i < rawDataKeys.length; i++) {
    			graphData['labels'][i] = rawDataKeys[i];
    			graphData['datasets'][0]['data'][i] = graphData['rawData'][rawDataKeys[i]];
    		}

    		graphData['datasets'][0]['fillColor'] = gradient;
    		new Chart(ctx).Line(graphData, {
    			bezierCurve: true,
    			bezierCurveTension : 0.3,
    			scaleFontSize: 15
    		});

    		selectedMode(graphData['curMode']);
    	});
	}

	function letsSort(a, b) {
		a = a.substring(2, a.length);
		b = b.substring(2, b.length);

		return a - b;
	}
});