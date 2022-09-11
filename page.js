
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
			['00','00'],
			['000','000'],
			['000','000','000'],
			['0000','0000','0000','0000'],
			//['00000000','00000000','00000000','00000000','00000000','00000000','00000000','00000000']
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
// so this code adds different amounts of rotation to each colour,
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
	return 'black';
}

function showSequence(colours, sequence) {	
	var minimumPatternLength = 12;
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
				cell.style('border', '1px solid ' + (colours[y][x] == 'white' ? 'black' : convertToHtmlColour(colours[y][x])));
				cell.attr('title', makeTitleCase(colours[y][x]))
				var degrees = 0;
				switch (+fixColours(colours[y][x], sequence[y][x])) {
					case 0: degrees =  90; break; // up
					case 1: degrees = 180; break; // right
					case 2: degrees = 270; break; // down
					case 3: degrees =   0; break; // left
				}				
				cell.html('<img src="arrow-' + determineTextColour(colours[y][x]) + '.png" width="32" height=32" style="transform: rotate(' + degrees + 'deg)">');
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
		document.getElementById('outputTemplateImage').crossOrigina = "anonymous";
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
	d3.select('#boxTemplate').style('display', colours.length < minimumPatternLength ? null : 'none');	
	
	d3.select('#outputPatternImage').attr('title', generatePaintingName(makeTitleCase(colours[0][0])));	
}

var originalImages = {
	black:      'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABJElEQVQoz02Sy4oCQQxFs+qdYO8EER8ILlpGFBQVFET8Bj9KmP387Zx4mmgTmlTVualbqYr1erfZ7P8Wi9/ZjLzrtiRERDBcLrv4+larn5xlGQHxmk4RMyRRwP8xHLpE0jRNiDrlDgSF27ZVwNJoNCYBYDIsz5/tRLVEvTQQYY6GJAUQCKTxQ1XX5LRUw9yqbEiTIC4N0bw/ajNJ6d4SnF6hWdMMQ/LJZG4bAMjzKB5AJUR11mYAwTwHA5IU+MGVV3I47AEpYFI6BR7AO7LlHgBaJ4X2AltedwmkwJsR2u2PxPl6v9weHzMQ3iUECSF9OF2Izw4IfDl2DcF3+aLdJHcoG74CBPyrJ9iQVklk4eoPnBuWAQVwJL2gHjCofsq9qLLS/AMonoH84Kp5AwAAAABJRU5ErkJggg==',
	blue:       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAyElEQVQoz4WS0Q3CMBBDvQcSQuov4psP/oCZmKFf7NFFOgAL4eDqcaSVkE7RJbbPl0t0PD3vj9ewvzqcH3bn5IRPfB7UIbOz/ysIQcM4RwrmtQsIDrWSH42Ty21q7Y0z4a0P0TQHb9JVqIbBHN5G9uOQwqEmYa2yaBaHTbZXZGgEG1Ia62QQtO6nCrgVVsp0c+NNn6A8rngduuxq4/+dEq9br0ht0OUdGHkAfMIGQqaqDrCeT0W1/nl1pvWDxFN8LAQxIecrpMM354T7eX7PFuUAAAAASUVORK5CYII=',
	brown:      'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABDUlEQVQoz22SsUpDQRBF9yeiZcBPUFKlspA0AYOEFFap8wGmiAEhYlIEgiAI1nYWfomFf+RZzuOyPIRh2Td7z8ydfVt288uf10fWxOfD9GVxZXKwPpxtT+xZ2RMl6rfVzddm9v00D8BGEfswpa0NQKCzT5qcP7+HKdaOmazH+5HA5PauZYqFEalbjod8WkJXq+sLGcp3HXSiWqDnKkydwdpxn7njitWwYu3AnRAOE77niugARyFrjVyxgK4EUJMpyf5L6oqk49UOjpJr7ZGESYbmZust5Z+TsmlEYsTvx151BTzgOwwAK6bFUBM5Lb6tlhGQiRMz9T/kPRLtPFFwam333dA+SeextoxHLfkHliI4Oacb5tAAAAAASUVORK5CYII=',
	cyan:       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABL0lEQVQoz12SMUqDQRCF5w5qIngLQTFCAkHEUvAY6azEFIKdRZr06f7mh+QEuYKBRAu9Tr6Zt5lsfhiWneW9NzNv1i7evojeYvH0/ELs/v43u1/Oq/VaL2eTd6Lftv3Viovdjx5uB0MIl8vl9/aH6KBd8WMOodc0cAy0CMnpooMAWhjzW9OoK3FO0NNZ4cTl/PXThFMd2tMwoNUqZyFE+Aw14frmTqleSDlTHjRa5uO3bVbgVe0Ox496ZIBEO0G2aDKU1AlorxOz1Wj8MFnp6Ai14b4dbKnRSDuBBBlpJ4G01AkbQKsXE7vWznDToo72A5rT0vJaWNVkUb1THzrXKYSnYeIxPd2p5VJQLWsKH0uF6azm+NfoLFIjybo0iov8QMuk10Hzwzn9hx6ENRWwPaABKF3uEWuwAAAAAElFTkSuQmCC',
	gray:       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABD0lEQVQoz22SzWrCYBBF550EIQtBKKEgWNtANxaKC5du7EIXfY4sssi79uiRawgdhmS+L/fOz53U665bNit8GIZxHAm+Tmd8sWw+9t8Ex8svmMDKV9/3EPh8+LmKlsDxHwKJQfM5tzpHCPim+5SD13A30RJW67bdvnsksGw4N4LJXjZv3NoMMTfGBE4ls1KdIjgxIC8lyHd6nhVZbHe8G3waC836OBkraAMFwNBNAiCgUeJGSFfWdSqeasBguGKQpWY6wjG9e8wY2VUFJ8fGrINFANL7H1Q6sYHo6FTux4mp8Bxan2nvvtwJUNUrcdPtyHEYJyG3cj9aMod7sYgqYbSexT9knabPrdtwd1M0wR/9YAseh/d/ogAAAABJRU5ErkJggg==',
	green:      'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABMklEQVQoz12SvUoDURCF71OsteYHe58hYCobCaggJMVikUpIEwRJl8YyVRo7fZcETFIkr+MXvuWsCMPunbnnzJyZO6V+v8F2xxM2fOpiOX98PWCv6+7ss7f52RPELaD54RC6m/TvX65DGIwun98qCPPvfr28EFa8Bo0PIWSgcMaLivQQcOEQL0ETwra7AxGycg2aCITp6srzWZK6URK0peTDxEC3BISC5vQXTQq+KAGtNlsC2fSggebC3FwHDRlVaCPSNo1jbkEQkCHaySqvZHx2KUezjsKogB6CRRngbMs0qpJmBLRDLxlo3ogDd+R2euqx4JlgAnBEMdFcp0vfwZZagtGg06LqCd4+dpoKzId2cXwdc0c3LlCbgdasBjw5fP91aSIrN8uXbXOZQ8h6a1nvX8UXRs8wRVstAAAAAElFTkSuQmCC',
	light_blue: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABBElEQVQoz32SPU5CQRRG71IkVCaE0BndgzW7oYKCygW4BxsLY6GtYQcEYuzcAA2ERDjkkA94Asmdybw737l/86o1/Ly7f8YeXmeP799Y/+OHHU+n+8QZ/2rz1x5/4WQv1s3grcFwuO2MAPQAoPG8AzDycA1jeO74hJGfL9cAKveAjIreyxS1vDAASbRCFwZANdLJYqmCg2WjBC5WGOvGElI1mgQtk8qcje18wpRz5NtZ/W4OsdOoApnKNNkTm5JSZ2atpizaAFGn4mO1Vs7bPFbSiO3LGH6XwV5lGuo84gmQMlDD8A6Nfkybvvf/EjuM/VxnKvPCe9zPJabykP7DMpnbf2YL/NXUJbqjTTgAAAAASUVORK5CYII=',
	light_gray: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABJElEQVQoz12STUoEMRCFcwh/juRKlEFo1MW4FREZRb2AuHd2gVlkOddwIy5cDAOCcxu/9Berg6GoTle9l6p6Sco5f222w/Vd+Kv754PVqlop7AGcDhfCCCY+gvTvH59GDtdr0ayjk5kELBHFHl9ev392eIwcNH5JSzg+G/LfahVIi8BAm7OaBLqiDjZVeBuXIMjSPCJ3q1UQZEiaBZ0tOPxOBIw6tuSmDzb1SkmXtw/nNwu76nFxdvDRrcoKoe5KUXhy9oOnt+jH2UAmC7WbGs2znUFOCFBn4HYVar542lsuIeyPwwUuxHUzDU0oOHhHooJnqxKRFAIHx8YcxmB/ramXmQ0a/JskXg0R+k/9dfpgqwbjO5UQ77JV6PuRoAaB6F8+mF9TOd5WWaZvfwAAAABJRU5ErkJggg==',
	lime:       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAA+0lEQVQoz22SMQrCUBBE9wKWolai4KFs7DyHNlaeIWBrKitPELARrD2CECySA8SXzGfz8w0Mwd2d2b87rh0fy6bM8s9+d52PYnuZgeo2beoCssEmIEWAbBRUv/kEJjDFgGZoTq+VQF5fNWoFdUFrE88HgHR+r2PZiEDZWCOgJA/CDmWGrBfA8C0pgIStVQcC4GX16y3qBK1LEkAlYAbZd3gugEj1fRM7GQT+iMoSSJP43o/kU8WP8NvZA4GQrCGqs4OA2HcQ+18QW2xK+QlohnhuPxlZbBTkOusGQ7t/VGz19nZwTIyArnHcW1uptww0nbfeIZWM4ZP4ef8AzkKf5KKIJ3wAAAAASUVORK5CYII=',
	magenta:    'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAA2klEQVQoz4WSMQoCQQxFcyFB8B4WVpaWXshSrCy2FktRbES2sLESPITgAXzwIIzDLAufMJv5P/nJbNzmp/f61S+vxPviQvwe+8/+DDiQB3KMUX5wJ/sw60BqGgI7yIDaTXeAg/q2QBvwtpMNSTKpKfuEd1aysBmj3bLPc/WIsjbXZAHTC86lBnLIxkayyZYCoE81kb6BTYBsa5tPTeTKc/0KNJNXib+1Og/FELilwXfICMNFoVHAZsYFWtI0AvuPdHCG0pKytiDXxUhpqS2o1uJjDc7g713FaugfhFj0qX3MQWAAAAAASUVORK5CYII=',
	orange:     'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABE0lEQVQoz12SsQ3CQAxFvQSkgMxBRckWNDSsQJuSIdJFSEGCBSLRsgMlEgPQkiLh+77zdSB90Cn2s799Z5+qhOZ17YfTqr9u8A/5l3GAlvc7teg65FgATcNDf15DAIq2fWztvQ89dwYAMlRCtgOpMDvwC5KYCgEmEx3oQTDKMzuiVUkSxswLTwCLKZyPx+wJSE5QmKYZzssLAGwckb4jPA5spSZ0T8/GteS+x9fNF5ryhLG8A5pVq4DEsDkO6BCWEOCIMh1V06254aqcHY4QGZPjvxGR6n1SeQKQA/gJiAeSgFj35P4HgBm4z8vrBiCun4zfNIH8FSBGu8XlkjNcQNwfs5mRjyhGTzh2rDVrPjEqz4Qvek+KSyxS0ioAAAAASUVORK5CYII=',
	pink:       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAwUlEQVQoz3VSwQ3CMAz0sgzAHDx4lhVA4hUQ7NA/EnPAAJxzqe26RnKtxLmzr5fI83G9tTPy9z4jPocL8nt/eu2OjFjBQiLaqgSl4KkS4h7ZQVMbzGWBU6nRU+McH9UrKqlEE6d5wdkfCr6kxBsT3fms6D9Ec0olY9uPlJB6l0oslOB6giext/Ep3gmlku00Wen5o8ScHC6t7rXqHX0XP46ehlHpliR7v76mhMarc1uNg4oVE1oJW5f4qq1INB814gfhATvTFimXHwAAAABJRU5ErkJggg==',
	purple:     'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAA8UlEQVQoz12SOwpCMRBFZyPqBqweKi7EykYQN2OhjSAWVq7Cyt5duBSPnHAND4aQz7kzk9zUcXieF6/H5jOfDwZzlxwRh9k9RyzL3WgYWUYAHY1kcQbtoqdFkzjVyqzX1dsiKcXxsFwzYWQOAL2f3arve5QeNPR2coJugnQVDZwa0J7+CdLG6NL2Q+ymFzj0Jq2gdpKC2Q/tWEH7V+/vg4CWaIxSfx/6K+YNFEATVmiCeKkg3ccEBDGxYpA04S0ZOfL5pZugv4C0BtnJiG5OWzde2gBN+45ukgigGdfTZjK3waZimQodg/J//WC+jzYz+QLLPjaDx1DMLQAAAABJRU5ErkJggg==',
	red:        'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAA60lEQVQoz2WROwoCQRBE5ybKIhoImhuKmYmRp/EGgmDoDQwNvYMoeCOfvKVsFXqX/lRNTde0w3C4Hwz414Q4dd1lNiYe6xVxno4sW4XWvwHiud1AuM4nchqfs5xBkKOgDoRwvggktvynL0EO0erAlnFbLrweeUYkLSv+EIhsAg1AryCa8yiyA7eidA3QsaG/UtDsmtXhoMnox4MWpx2AEGQfjh6E06hVkFOfKU0DWK+QW8WQSojLH1sdVx067h0Fy7et9+MunDyzfNXSoQT8Jsipbyw67nm2yEZh9v9w2mWec3tb/zmgFaxo4gWnBiaoo8dV2wAAAABJRU5ErkJggg==',
	white:      'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAA+0lEQVQoz21SMQ7CMAz0X/gFEiMLE1NXnsEbeA8T4gGsSEiAUOkEOyod6FK45NIjNUhWaJy7s33GuvOE0b47hK7MjFa78fqCs2lqvlp4K4uuWpDgYro8fNEREwk9Gh/kE8EK++MpPZHgJMMDCpYFvgGlPJLhjE2acFJl4Ip+knyE9i3FHzcGtfNZpWJiK0vobHPFqfpEI5MIocWs7/m2gptoydVE0iQsDWTpvQisiSTKmtOg8TgRHIBoZkIF3hn0JA9CyUwEVv+FOrRaMDWa1twvPreV4yXC38VpHmcG3LPBPzTzm7Zy2QhAYdHreR/Y6pwFAjjtsX7cAP4AE21cA4uMlXEAAAAASUVORK5CYII=',
	yellow:     'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABHklEQVQoz22SMU7DQBBF9wKUOQLHoKVKQUWbE9CmosotKNJRRSBBgy+QQ6TKCaLIivvAm33OeEUifdnrmf9n/s64nHcPp6/Z72Ed6LvAYW2EFOBw3Nx9vj69L+egJJsDieHnPj/HKlUA3l4eQ3CdbksIXfQfoQlBVtXApBm2mlSDABS/0/F5v4AXkeMGG6NSzX4BobQeZIPoWWUi20Io/z1c2HTQLSk984wObQFCyc44EbzpCjSW6gZSzOBTE4Jh6yqKkzGX3a03aapV2DHWSdB3Om4nIymfNxanJjxUDTxAK68XdyDHOto/atL0HSW/V8+25RAdeCHI/Y/3ZqYX3/5INPFKRX/tP+PVnQkp2BQFLr54FTUuX5lx4Fk2sj+V0AOAvwXiDgAAAABJRU5ErkJggg=='
}

var improvedImages = {
	black:      'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAADAFBMVEUAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7////isF19AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAWklEQVQYlXWPsQ3AIBADPYqlFIzxcuP9R4pJQvgiMTS+hxMAI6undbp4kTuCgdqdCpp7zaUwEb+RDZW3j1HW0X2s1ygHuP51VAT9RG4aXr7xAO0+37fGnz8/ATnPD4RXDBgxAAAAAElFTkSuQmCC',
	blue:       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAHLSURBVDhPlVMxS0JRFD76FHxqokWCaRmFgiQuDTq1pIPQ0NZQa7RJtLT6C/IHtBbR0hQ01NTk0iASQoKLilBmIsYzU8zv5NGX1NAH79173zvnO9/57r2GxHF+ULu5I615TYDq3KL26yUpio3XevT772Sf2+FYxAFGvCT5P5AcJhA2ANVRBdWmH4HEg8Sw7I0NlFSG1PMsJ/tCR6Suh6g02+YgwUrDTtpDgSqFEy4gYILA3inBB08yzome2zI1n6ujkG843V6qJRaZSO+Z4nT40tbPALk2olyhny3w3NT6+DHWczky5yu8ftteI7VopV7naeTBUDKSURUqMJdvMkIB/nHMUKG2G2MvjJAvyQgSTHugJxISEBqlivz4C0IohZADLxRzr5HuVEzc50vUTZ2re7LYHOR2ealXq1M5rNJMqcVr+ICq5oV5Kl0cTjyAo8Wz/XFvvymRXYJizAW8jZjI0fUED8by9FKRjCISJ4fJEI5kmACQOwAS7DkOF4BkqYoYQIgMq0ubTCCMEiC7I+4DaA0tAnJyFa8/lYYZeMyWIHW1R2a3dP3jZIwwsxfxcSIOFFR1q9ZJCzASKqQNXB6okL71lwnAffAk4/QFGKEZdwGm4J8AAAAASUVORK5CYII=',
	brown:      'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAHrSURBVDhPbZLNS1tREMVP3ova0AhRMbbVGtTEL5RqqUjtxi5KFwpuXJX+HV0H/FfcFzeCuBAUBAmlLqTGiqmNbaKtMSHJi0lNtDlj5vVW/MHjzv045925M56P0cUbNFhZj2HgcYfEff1PkCtW8HJoGqtbqxgb65f1vb2EGxOrMYqYDA/1ugfy5xcy0syEJooYqFj/Xr2qyli7vsH+z12MdE+4IvMmxDLF/HulLo4fJGWNnP44a0T/ME0sCudmJ+WaFH9LpHCUzqClyYu2YAcu/9TkMPePvn6XmNCEn/sGFKhYCfhbZNQ0aGaaEM/yh3mpAg0Ib8HYW/+cUllMfc02Xk+/xcbOmpwhNOMNLZYqeZzG4eGJ5M45TSi+m8ajni6JHwQCss4q2Uvv30XDvRFc2Q4qTgmFvINctiBfzb69Vdm5RNXrSBqbn2P4fZ5FZ2c7uoIB2E/9xahu9vWEEQlF5LCaUUw4576vtYaD41OkzjJInPyC24laV742zRQ+oJaSKXAvmY3LnPzXyoSvzDz5cCogNCLj4VdIpD5JTDxLi8/FQJuDaKlolM7kMDM1KkZe30NZp4E2oHW3NcnAYEhGvnSpbrId+yLXptAUL7yZum2k+0y0dC+eDYqJYoqJ24lmCkTrrN1oomIA+AvDiw0zh4DJ/gAAAABJRU5ErkJggg==',
	cyan:       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAADVSURBVDhPpZKtEoJQEIUPBqvdogSTPgZjMmjyVXgEX8VkscljYHJGtNiNGkTOwjLLHeaK+gX2BL69e3+C5eGco2AbjVnQR4BVkkm27KJQ6hPyO9bJRWqPH5WJT7aoEzzyV9myQLtaXFknUGQC0kVuQxr8KpPePzKpb0FReR6nUi3Z5F4lYDYaSq3PgHxaOTwNqgSk15vUusE3Y1ukQVe5bQvyDvj63PtdxMcqlew30yo1kQlcmdjVbHZpHKILRZ9MvA260PqQiB4SsdlCVybwNfHJAPAGqAxPb8m2NcAAAAAASUVORK5CYII=',
	gray:       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAGySURBVDhPZZK/rgFREMZn1xKhIKEQiSj0KhJKpcI7KDwUiULiDTyFQhQi0YhEQRQKCuJf4t7f3J29x71fsjlzzs73nTnfjNfpdN4S4ng8htEPut2uDIdDqVQqkslkJJVKyXq9Dv/+wA/XiFytVqVWq+nqIpFIhNEnVMDI5XJZ9vu9zGYzWSwWehYEgVwuF41fr5fEYjGNDb5LtkRA+ZPJRPL5vO43m408Hg8plUofIl6z2VQPSHw+n5JMJqXdbuvbc7mcxONxORwOmlwoFKRYLGoMeFbkAchms0oejUa6h+wCoe12qzGGUpEKYBjKrVZLlsulJvB2AzfbHlFEVquVnM9n8QaDQdTG+XyuqxkIzAOQTqfldDop0eDV6/W3qZNMJZQ3nU71DLgiGLjb7bSiXq8nv3V+wzriGgU4p4UGI/f7ffHZcIMNjjtQjUZDYwO5LhlvfLdsKxUvGKjr9RpNJePMf0bagCe+lUsysYnQMkRoFf2+3W46J9Zabmfw1AMSAQL2UQUifJTNZLIi5CKAbMo8g0pMEALgzePxWG+06TToIHHArUbGyL/k+/3+jywi8gVgmc2FVvRVHgAAAABJRU5ErkJggg==',
	green:      'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAIhSURBVDhPVVPBahNRFL3vTSZJEzIRjWilNYrFWAhusqtgBSm0OwV3XdSN4g+49h/ETf/BfUvduJGuii4KKiiaWmrFtKYzSTrNTDLOOY+XpGdz73vvnrnnnvdGPX/VSCRF47HI2WkkG296WBKPXpal60fybr0nV2/73BtEIveezLL2sBmKxmZlPuBhbsqVbE5LsZThGkVFz+yBaNH8Ekicrqt3SqLryxETFOPAAt0t3KwWxzX5TP0CY+sgJEejK2RCzv5uW8rX2iwAcLazuS+l6WMqqFTL4h/FEoUJaz9uHYpaWZ2jB5BdqBxLr3VRll4URzOiEKhUPUbHVdJqnjDHR3UcDUYzg3x/LcscM/7+2qZ0Kxv48+3knB8jBZgZXSEb+PD2F6PtDHx+jw8PJOM6XCNX658aCYjoCMdhJDqbmT3Jl7SEwZDkWwtDydJQlZ6zr7lGAGQYBjJgZYP8fVuzm3fJjHraHTACHAH3jKsauz2WDXL/bMh8/gGD7O1kJOoPua/xwnB1k2TIBkDudYxj1mjI7wYxOeBqkOA04pW5Mgus7NlGLLVFJfUlJdfTHGeQj3EsR0+ScQhzOkcB5U0VHZpmDbOzOxnztMFVr7fvJj93xz/QvwOfh39/eOdmhuwkSUQpxT349vBZ3jzlG/UCN1tNX9yc4pct+qlZMOzyTV+mawEjyItP83wzGveOZKZWIDHsGLmTwA0BVjY6mzcTyH/EsR65rKr2QwAAAABJRU5ErkJggg==',
	light_blue: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAADWSURBVDhPY/Tdefc/AwUAw4Arpx8y6JjKQ3kQwMXCxFBkJslgwMMGFWFguPDlF0PLsacMTFA+GFw+eouBiZUTyoMAfJpBAG4AyGZmbgEoDwIIaQYBsAEgzeg2gwAhzSAADoNrF15BuQwM/35/xwgDfAAlDEjVDAJwA0jVDApwEAAb8PfrB5I0Iwc42ABdazUwhxiAHuBwL4CijBDAFlsYKbHGShpn1GGLLRRrsWnuO/UcykMA5ACHG4BL87c//6AiEIAe4GADiNEMCiOQzegBTmF2ZmAAANI+eqZdsG0iAAAAAElFTkSuQmCC',
	light_gray: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAADAFBMVEUAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7////isF19AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAmElEQVQYlS2QMQoFIQxEc9gtneKDkErIFSw9UOopc50/cRdF8PnGRI18NDDnAKlpvSKJ5X6JAVERAPwlMqrIrPORNvYOVh6MJjIoY2dRznLYg4hghg5uytzH8EO+ZE2TNt1P5RYBli6FuhLhVjC7rA7mz08qFUmLOE2GB08Foo1LBHa3aC0cqqACMh7rbTRA4XttvOC5/8A/k5acimejCH4AAAAASUVORK5CYII=',
	lime:       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAA+0lEQVQoz22SMQrCUBBE9wKWolai4KFs7DyHNlaeIWBrKitPELARrD2CECySA8SXzGfz8w0Mwd2d2b87rh0fy6bM8s9+d52PYnuZgeo2beoCssEmIEWAbBRUv/kEJjDFgGZoTq+VQF5fNWoFdUFrE88HgHR+r2PZiEDZWCOgJA/CDmWGrBfA8C0pgIStVQcC4GX16y3qBK1LEkAlYAbZd3gugEj1fRM7GQT+iMoSSJP43o/kU8WP8NvZA4GQrCGqs4OA2HcQ+18QW2xK+QlohnhuPxlZbBTkOusGQ7t/VGz19nZwTIyArnHcW1uptww0nbfeIZWM4ZP4ef8AzkKf5KKIJ3wAAAAASUVORK5CYII=',
	magenta:    'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAACFSURBVDhPY/yy9fR/Bizg74cvDN8PXwOzOW21GJgFeMBsdMAEpVEAsmYQALFBYtgAhgHommEAlyEoBuDSDAPYDIEbQEgzDKAbAjaAWM0wgGwIE6maYQBmCBM5mmEApBdrNJICGD8u3Y81IYEAzHWghIQLMIFSGDaMDrCpAWGKvTBqAAMDAAlNV8YRhodLAAAAAElFTkSuQmCC',
	orange:     'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAFlSURBVDhPlZOxSgNBEIbnkvO4WGhpSIix0ELwHcRH8A20u9I+hYhY2dgIKUR7G59AfAZBsBDBIAm2imA4E8/9/7v/uCSn6Ad7O7vszPwzu+eNbruJFRjfXZgXLlgyfOO6urHL+Sf8bCbjq6PUWA/M8wNLRjGXj8eRLc3TJK+fZs29Lu0Kv2KtkQ4/pLOyh3Oc6IgxdKN/EnGPCpjZOZbJxcFFF6DWaFkt2/sYPDMQ8FFzEUWut1s8COBM9ntmB+2SElx2NA5AHjICHJRNnPM0FTQLqOsrq04qMiKbA0FeeqkSAFvZARUgiOrHAUgP+jdWP/9iKdrH0FpMvAPUjxLU9eXDa4ubW6l03A54GFh1u5PaDgZ4P43yetUwyYYK4F1uWnL/NOEMWIKuJO+2Q1LhiHL0qKaZfEgga56AY3y2MyNdMACko3aSXVXesMyxzBnM9EDlFK/qN/JbUJC/OoqZ3/l/mH0DuhSl2+MTTBQAAAAASUVORK5CYII=',
	pink:       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAACeSURBVDhPvZOxDoQgEETBXqsrr7H1//0Ke1sbSyu1FjPIGFwXucTkXrKwIZmZhahd286ZFxRhz+L6wZedl7MHWQOKYorvJ3QZA6Zo0CRpIFMBRNs4neXP/CrQkimW/PyIACYs29THmV8jZLocm0UeJ0iNzXRw+ZDwcBRArOGqMnQHNwOSSyaXK2giAKEmBrc3iK/wJCT/+5lSvDQwZgfRI1mf4q5aNgAAAABJRU5ErkJggg==',
	purple:     'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAB8SURBVDhPY4yR7//PAAVGovoM515fhPIwATZ5JihNUDMuADaAXM0gwESJZhBgokQzyHJ4GJAKYC4nywBkb5PtAhignwG4YosoA/BFNWOfyT54UsYFkDWjG4aSFwgBdM0gPk4DQJLoAJtLsBqAbhM6QJbHCERSNDMwMDAAAOyaQ79EpHOaAAAAAElFTkSuQmCC',
	red:        'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAGsSURBVDhPbZK7SgNREIZnzyYxMVGRhERiEtcrXjpLQRCfwMrn8Ql8ICvBSlKIhZdCIhi1ECsxGhI2634TZ1klP5ydc/v/+WfOeu3DvUhiXHReCRJGkfiep3NQdE5qpYzOW82WRr9YkrD3qXPHBzLENGzdG42k8zHQOURgZOBvRf4JExdnrRczUitkZX7Kl3I+I4WMJ6NQZBiLDYaRNOo1cbmcRMOxIFAHYGU2J3nfSf7XPpG12ceJwZyARACby5vbUm00tVaLi5WKnlOSWbeIUCJAsybBL0yPY+zo/OZBzi6vpH3X0T2EvNMgiCDvBgt6+an7pIeAMnACIFtj7ZUOdtbEWWYj98ORDtCPCW/PXbW6v1KX9bkpaZayiRBOlL00k9UNw2qtmtSOCFZzlWrSWERITGNdmpz8KLEbhjkBiCAGEKFkLcE2w+8vjRtB8OeZ0rAnBtbcpPUv7++JCNmsmWmSJUv/0o4FB9hFBKI1E6vlclkvmiD7rBkkUgeIcBlYRtY0kuY93t/qHqBEABl418dHkS1MNQ2e8b/1NBwEiCA9B1pKTMbVJLKIyA8IM8s16qUb/QAAAABJRU5ErkJggg==',
	white:      'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAACvSURBVDhPxZMxD4IwEIVfm3RjYZDFzf//T/wFDroYHSBa49oBvQunj4YEqIPfQB6Fo/eOV3dvrz3exHjBptmJRNeeUNdb1QY/f8QzqqpR7fW6kpTSoAB3POz7EIIu8g4Cvyhwh4Z7xptaKKXIAqMWBg2zYsi9kK+NZmB/oZSfLfz/A58h5gObSiIP0PRkDuaizCy2YB3meNlNosvxnINrvLRqJ2sNUiO1iy1w+r4AL8JVY8XCGSRPAAAAAElFTkSuQmCC',
	yellow:     'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAHfSURBVDhPbVM9S2NBFL1vjM/I5sUICsFyGwVFooWCHyBY2WxhZyO7hdWCWNrb5E/4gaCCnVsoKIq4S0ARFNkiNlsuFqKLeZLdl+hzznneIS4eCPPunTlnzr1z4z2Xx2Ox8Do+YxFJdSVr/bdUfixKpqdHwnI5yb0COQUFlAxCPforzZm8ZIYWXa6R0CiGvBffLtMBDgZjRW4AjTG+Ff87okB4VnQ3xrdrrhwn0tIt8lRJcsezFHn4ecnYoOY4+sMAZK4PJwkJMIHc702RiL4EE+t0kB2clmxfwQrYpII3+x/F65xLYj8n0twlKT/NmKVAxLoKr3Z51mADCa1TyeH3L5IZXxWpJQSKIW/LBRhHv8QoUUVAbCRXTr5yHz0CqRbe8KlR9uZKmxg0xInY+nCQDf13TfLW4YDb10ZLUyAH56P8NGiIE3kdHrUJwZnJizci7VN7XKtRXR6rkXh320Gc6y+ws+xwad69Cp/Q2sULfCsNk/Ch1XcrYLTDhHWgtQL3Rwvu6UACWv0UV+DTyKkYjO6bMixUBOIUscCN+c4crQMgA/wvYKpMKu3GlNYBO0SYA2BjqehcoC8AzlMAJIWKAHCxX+p1DYMLvRnnAA6SBoSdLsT47Rx3O8vvkUVEXgCXTgGhQY0l9gAAAABJRU5ErkJggg=='
}

function makeCachedImages() {
	for (var colour of allColours) {
		d3.select('#gt_' + colour).remove();
		var image = new Image();
		image.src = 'data:image/png;base64,' + (isImproved ? improvedImages[colour] : originalImages[colour]);
		image.id = 'gt_' + colour;		
		image.style.display = 'none';
		document.body.appendChild(image);
	}
	setTimeout(function() {
		if (window.location.hash.length > 0) {
			decodeColourInformation();
		} else {
			generateRegularSequence(2, 2);
		}
	}, 100);
}

function toggleImprovedTextures() {
	isImproved = !isImproved;
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

function isUsed(a) {
	return a;
}

isUsed([showBuildHelp, toggleImprovedTextures, generateMess, generateChaoticSequenceAnyColours, generateChaoticSequenceTwoColours, generateChaoticSequenceSameColour, generateRegularSequenceAlternating]);

makeColourList();
makeCachedImages();