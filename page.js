var allColours = [
'black',
'blue',
'brown',
'cyan',
'gray',
'green',
'light_blue',
'light_gray',
'lime',
'magenta',
'orange',
'pink',
'purple',
'red',
'white',
'yellow'
]

var niceSequences = [
['01','32'], // normal
['23','10'], // offset x+1,y+1 (inverted version of the above)
['10','23'], // offset x+1,y+0
['32','01'], // offset x+0,y+1

['02','31'], // bottom-right, top-left, vertical mirror
['13','20'], // bottom-left, top-right, vertical mirror
['20','13'], // top-left, bottom-right, vertical mirror
['31','02'], // top-right, bottom-left, vertical mirror

['01','23'], // bottom-right, bottom-left, horizontal mirror
['10','32'], // bottom-left, bottom-right, horizontal mirror
['23','01'], // top-left, top-right, horizontal mirror
['32','10'], // top-right, top-left, horizontal mirror

['03','12'], // bottom-right, anti-clockwise
['12','03'], // bottom-left, clockwise
['21','30'], // top-left, anti-clockwise
['30','21'], // top-right, clockwise

//['23','10'], // top-left, clockwise (same as offset x+1,y+1)
//['10','23'], // bottom-left, anti-clockwise (same as offset x+1,y+0)
//['32','01'], // top-right, anti-clockwise (same as offset x+0,y+1)
//['01','32'], // bottom-right, clockwise (same as normal)
]

var isImproved = false;

function random(start, end) {
	return start + Math.floor(Math.random() * (end - start));
}

function getColour() {
	var colour = document.getElementById('userColour').value;
	if (colour == 'Random') {
		colour = allColours[random(0, allColours.length)];
	}
	return colour;
}

function generateRegularSequence(width, height) {	
	var colour = getColour();
	var sequence = random(0, niceSequences.length);
	sequence = niceSequences[sequence].slice(0);
	switch (width + 'x' + height) {
		case '1x1':
			sequence = [sequence[0][0]];
			break;
		case '1x2':
			sequence[0] = sequence[0][0];
			sequence[1] = sequence[1][0];
			break;
		case '2x1':
			sequence = [sequence[0]];
			break;
	}	
	var colours = sequence.slice(0);
	for (var y = 0; y < sequence.length; y++) {
		var lineColours = [];
		for (var x = 0; x < sequence[0].length; x++) {
			lineColours.push(colour);
		}
		colours[y] = lineColours;
	}
	showSequence(colours, sequence);		
}

function generateRegularSequenceAlternating(width, height) {	
	var colour = getColour();
	var set = 4 * random(0, 3);
	var chosenSequence, chosenSequenceAlternate;
	do {
		chosenSequence = set + random(0, 3);
		chosenSequenceAlternate = set + random(0, 3);	
	} while (chosenSequence == chosenSequenceAlternate);	
	var sequences = niceSequences;	
	var sequence;
	switch (width + 'x' + height) {
		case '2x4':
			sequence = [
				sequences[chosenSequence][0],
				sequences[chosenSequence][1],
				sequences[chosenSequenceAlternate][0],
				sequences[chosenSequenceAlternate][1]
			];
			break;
		case '4x2':
			sequence = [
				sequences[chosenSequence][0] + sequences[chosenSequenceAlternate][0],
				sequences[chosenSequence][1] + sequences[chosenSequenceAlternate][1],
			];
			break;
		case '4x4':
			sequence = [
				sequences[chosenSequence][0] + sequences[chosenSequenceAlternate][0],
				sequences[chosenSequence][1] + sequences[chosenSequenceAlternate][1],
				sequences[chosenSequenceAlternate][0] + sequences[chosenSequence][0],
				sequences[chosenSequenceAlternate][1] + sequences[chosenSequence][1]
			];
			break;
	}
	
	var colours = sequence.slice(0);
	for (var y = 0; y < sequence.length; y++) {
		var lineColours = [];
		for (var x = 0; x < sequence[0].length; x++) {
			lineColours.push(colour);
		}
		colours[y] = lineColours;
	}
	showSequence(colours, sequence);		
}

function generateChaoticSequenceSameColour() {
	generateRandomSequence([getColour()], false);
}

function generateChaoticSequenceTwoColours() {
	var first, second;
	do {
		first = allColours[random(0, allColours.length)];
		second = allColours[random(0, allColours.length)];
	// don't allow the randomly selected colours to be the same
	} while (first == second);
	generateRandomSequence([first, second], true);
}

function generateChaoticSequenceAnyColours() {
	generateRandomSequence(allColours, false);
}

function generateMess() {
	var sequence = [];
	var colours = [];
	for (var y = 0; y < 8; y++) {
		var lineRotations = '';
		var lineColours = [];
		for (var x = 0; x < 8; x++) {
			lineRotations += random(0, 3);
			lineColours.push(allColours[random(0, allColours.length)]);
		}
		sequence.push(lineRotations);
		colours.push(lineColours);
	}
	showSequence(colours, sequence);	
}

function generateRandomSequence(availableColours, mustHaveTwoColours) {
	do {
		var sequences = [
			['00'],
			['000'],
			['0000'],
			['00000'],
			['00','00'],
			['000','000'],
			['000','000','000'],
			['0000','0000','0000','0000'],
			['00000000','00000000','00000000','00000000','00000000','00000000','00000000','00000000']
		];
		var sequence = sequences[random(0, sequences.length)];
		var colours = sequence.slice(0);
		var chosenColours = [];
		for (var y = 0; y < sequence.length; y++) {
			var lineRotations = '';
			var lineColours = [];
			for (var x = 0; x < sequence[0].length; x++) {
				lineRotations += random(0, 3);
				var colour = availableColours[random(0, availableColours.length)];
				chosenColours.push(colour);
				lineColours.push(colour);
			}
			sequence[y] = lineRotations;
			colours[y] = lineColours;
		}
	}
	while (mustHaveTwoColours && new Set(chosenColours).size != 2);
	showSequence(colours, sequence);	
}

// the glazed terracotta blocks face in different directions.
// for example:
//   light_gray points to the bottom-left.
//   lime points to the top-left.
// that makes it a bit annoying to generate patterns that work for all colours.
// so this code adds a different amounts of rotation to each colour,
// which aligns them all to point to the bottom-right.
function fixColours(colour, number) {
	switch (colour) {
		case 'pink':			
			return (+number + 1) % 4;
		case 'brown':
		case 'green':
		case 'light_blue':
		case 'lime':
		case 'orange':
		case 'purple':
		case 'white':
			return (+number + 2) % 4;
		case 'light_gray':
			return (+number + 3) % 4;
		case 'black':
		case 'blue':
		case 'cyan':
		case 'gray':
		case 'magenta':
		case 'red':
		case 'yellow':
			break;
	}
	return number;
}

var base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";

function encodeColourAndSequenceToNumber(colour, sequence) {
	return base[allColours.indexOf(colour) + (sequence * allColours.length)];
}

function decodeNumberToColourAndSequence(character) {
	var index = base.indexOf(character);
	return [allColours[index % allColours.length], Math.floor(index / allColours.length)];
}

function decodeColourInformation() {
	var info = window.location.hash;
	// we store a version number after the hash,
	// which will allow us to easily change the format in the future	
	var firstVersion = '#0|';
	if (info.startsWith(firstVersion)) {
		// remove version number
		info = info.slice(firstVersion.length);
		var lines = info.split('|');
		var colours = [];
		var sequence = [];
		for (var y = 0; y < lines.length; y++) {
			var lineColours = [];
			var lineSequence = '';
			for (var x = 0; x < lines[0].length; x++) {
				var data = decodeNumberToColourAndSequence(lines[y][x]);
				lineColours.push(data[0]);
				lineSequence += data[1];
			}
			colours.push(lineColours);
			sequence.push(lineSequence);
		}
	}
	showSequence(colours, sequence);
}

function convertToHtmlColour(colour) {
	return colour.replace('_', '');
}

function determineTextColour(colour) {
	switch (colour) {						
		case 'cyan':
		case 'light_blue':
		case 'light_gray':
		case 'lime':
		case 'orange':
		case 'pink':
		case 'white':
		case 'yellow':
			return 'black';		
		case 'black':
		case 'blue':
		case 'brown':
		case 'gray':
		case 'green':		
		case 'magenta':		
		case 'purple':
		case 'red':
			return 'white';														
	}
}

function showSequence(colours, sequence) {	
	var minimumPatternLength = 8;
	var tileSizeOriginal = 16;
	var tileSizePattern = 32;
	var tileSizeTemplate = 64;		
	
	function showSequenceTemplate(colours, sequence) {
		
		var uniqueLink = '0';	
		var gapBetweenTiles = 3;
		
		var canvasTemplate = document.getElementById('outputTemplateCanvas');
		canvasTemplate.width = tileSizeTemplate * sequence[0].length + (gapBetweenTiles * sequence[0].length - 1);
		canvasTemplate.height = tileSizeTemplate * sequence.length + (gapBetweenTiles * sequence.length - 1);	
		
		d3
			.select('#outputTemplateImage')
			.attr('width', canvasTemplate.width)
			.attr('height', canvasTemplate.height);		
		
		var context = canvasTemplate.getContext('2d');
		context.imageSmoothingEnabled = false;
			
		d3.selectAll('#buildingGuide *').remove();
		var guide = d3.select('#buildingGuide');	
		
		for (var y = 0; y < sequence.length; y++) {
			uniqueLink += '|';
			var row = guide.append('tr');
			for (var x = 0; x < sequence[0].length; x++) {
				uniqueLink += encodeColourAndSequenceToNumber(colours[y][x], sequence[y][x]);
				var whereX = (tileSizeTemplate / 2) + ((tileSizeTemplate + gapBetweenTiles) * x);
				var whereY = (tileSizeTemplate / 2) + ((tileSizeTemplate + gapBetweenTiles) * y);	
				// these numbers are degrees
				var rot = (90 * fixColours(colours[y][x], sequence[y][x])) * Math.PI / 180;
				var cell = row.append('td');
				cell.style('background', convertToHtmlColour(colours[y][x]));
				cell.style('color', determineTextColour(colours[y][x]));
				cell.attr('title', makeTitleCase(colours[y][x]))
				if (colours[y][x] == 'white') {
					cell.attr('class', 'bordered');
				}
				switch (+fixColours(colours[y][x], sequence[y][x])) {
					case 0: cell.html('&uarr;'); break;
					case 1: cell.html('&rarr;'); break;
					case 2: cell.html('&darr;'); break;
					case 3: cell.html('&larr;'); break;
				}
				context.translate(whereX, whereY);
				context.rotate(rot);
				context.drawImage(
					document.getElementById('gt_' + colours[y][x]),
					0, 0,
					tileSizeOriginal, tileSizeOriginal,
					-(tileSizeTemplate / 2), -(tileSizeTemplate / 2),
					tileSizeTemplate, tileSizeTemplate);
				context.rotate(-rot);
				context.translate(-whereX, -whereY);					
			}
		}
		
		// allow the user to share/bookmark the displayed template
		window.location.hash = uniqueLink;
		
		var data = canvasTemplate.toDataURL();
		document.getElementById('outputTemplateImage').src = data;
	}

	function showSequencePattern(colours, sequence) {
		
		var repetitionsY = Math.ceil(minimumPatternLength / sequence.length);
		var repetitionsX = Math.ceil(minimumPatternLength / sequence[0].length);
		
		var duplicatedSeq = sequence.slice(0);
		var duplicatedCol = colours.slice(0);
		for (var y = 0; y < duplicatedSeq.length; y++) {
			duplicatedSeq[y] = duplicatedSeq[y].repeat(repetitionsX);
			var dupe = [];
			for (var x = 0; x < repetitionsX; x++) {
				dupe = dupe.concat(colours.slice(0)[y]);			
			}
			duplicatedCol[y] = dupe;
		}
		
		var canvasPattern = document.getElementById('outputPatternCanvas');	
		canvasPattern.width = tileSizePattern * duplicatedSeq[0].length;
		canvasPattern.height = tileSizePattern * repetitionsY * duplicatedSeq.length;
		
		var context = canvasPattern.getContext('2d');
		context.imageSmoothingEnabled = false;
		
		for (a = 0; a < repetitionsY; a++) {
			for (var y = 0; y < duplicatedSeq.length; y++) {
				for (var x = 0; x < duplicatedSeq[0].length; x++) {
					var whereX = (tileSizePattern / 2) + (tileSizePattern * x)
					var whereY = (tileSizePattern / 2) + (tileSizePattern * (a * duplicatedSeq.length + y));
					// these numbers are degreess
					var rot = (90 * fixColours(duplicatedCol[y][x], duplicatedSeq[y][x])) * Math.PI / 180;
					context.translate(whereX, whereY);
					context.rotate(rot);
					context.drawImage(
						document.getElementById('gt_' + duplicatedCol[y][x]),
						0, 0,
						tileSizeOriginal, tileSizeOriginal,
						-(tileSizePattern / 2), -(tileSizePattern / 2),
						tileSizePattern, tileSizePattern);
					context.rotate(-rot);
					context.translate(-whereX, -whereY);
				}
			}
		}

		d3
			.select('#outputPatternImage')
			.attr('width', canvasPattern.width)
			.attr('height', canvasPattern.height);	
		document.getElementById('outputPatternImage').src = canvasPattern.toDataURL();		
	}	
	
	showSequenceTemplate(colours, sequence);
	showSequencePattern(colours, sequence);
	
	// hide the template if the template size matches/exceeds the minimum pattern size
	d3.select('#templateTitle').style('display', colours.length < minimumPatternLength ? null : 'none');
	d3.select('#template').style('display', colours.length < minimumPatternLength ? null : 'none');	
	
	d3.select('#outputPatternImage').attr('title', generatePaintingName(makeTitleCase(colours[0][0])));	
}

var loadedImages = 0;

function imageLoaded() {
	loadedImages++;
	if (loadedImages == allColours.length) {
		if (window.location.hash.length > 0) {
			decodeColourInformation();
		} else {
			generateRegularSequence(2, 2);
		}
	}
}

function makeCachedImages() {
	for (var colour of allColours) {
		d3.select('#gt_' + colour).remove();
		var image = new Image();		
		image.src = (isImproved ? 'improved' : 'original') + '/' + colour + '_glazed_terracotta.png';
		image.id = 'gt_' + colour;
		image.onload = imageLoaded;
		image.style.display = 'none';
		document.body.appendChild(image);
	}
	
}

function toggleImprovedTextures() {
	isImproved = !isImproved;
	loadedImages = 0;
	makeCachedImages();
}

function makeTitleCase(text) {
  return text.replace('_', ' ').split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function makeColourList() {
	var colourSelect = d3.select('#userColour');
	colourSelect
		.append('option')
		.attr('value', 'Random')
		.html('Random');	
	for (var colour of allColours) {
		colourSelect
			.append('option')
			.attr('value', colour)
			.html(makeTitleCase(colour));
	}
}

function showBuildHelp() {
	d3.select('#buildHelpShow').style('display', 'none');
	d3.select('#buildHelp').style('display', null);
}

makeColourList();
makeCachedImages();