var nouns = {
	// red + black
	'black' : [ 'Blood', "Witch's Cat" ],
	
	// light blue + dark blue
	'blue' : [ 'Teardrop', 'Raindrop', 'Ocean', 'Sky', 'Blueberry', 'Sapphire', 'Cobalt' ],
	
	// brown + blue
	'brown' : [ 'Chocolate', 'Mud', 'Agate' ],
	
	// cyan + creeper face
	'cyan' : [ 'Creeper', 'Topaz' ],
	
	// gray
	'gray' : [ 'Whale', 'Chain', 'Mouse', 'Fog', 'Mist' ],
	
	// green
	'green' : [ 'Forest', 'Leaf', 'Tree', 'Apple', 'Pear', 'Moss', 'Frog', 'Emerald' ],
	
	// blue + white
	'light_blue' : [ 'Ice', 'Shard', 'Ocean', 'River' ],
	
	// gray + turquoise
	'light_gray' : [ 'Whale', 'Chain', 'Mouse' ],
	
	// lime + orange
	'lime' : [ 'Lime', 'Kiwi', 'Avocado', 'Crossbow' ],
	
	// magenta + arrows
	'magenta' : [ 'Arrow', 'Arrows', 'Direction', 'Fate' ],
	
	// orange + blue
	'orange' : [ 'Goldfish', 'Lake' ],
	
	// pink + gray
	'pink' : [ 'Cupcake', 'Flamingo', 'Pig', 'Worm' ],
	
	// purple + sword + pickaxe
	'purple' : [ 'Aubergine', 'Sword', 'Pickaxe', 'Amethyst' ],
	
	// red + swirly
	'red' : [ 'Blood', 'Cherry', 'Ruby' ],
	
	// white + yellow + blue + sun
	'white' : [ 'Sun', 'Yolk' ],
	
	// yellow + orange + brown
	'yellow' : [ 'Hive', 'Honey', 'Bee' ],
}

var artists = [
'Leonardo da Vinci',
'Vincent van Gogh',
'Jackson Pollock',
'Johannes Vermeer',
'Sandro Botticelli',
'Claude Monet',
'Frida Kahlo',
'Pablo Picasso',
'Rembrandt',
'Michelangelo',
'Mary Cassatt'
]

function random(start, end) {
	return start + Math.floor(Math.random() * (end - start));
}

function randomItemFromArray(array) {
	return array[random(0, array.length)];
}

function anOrA(word) {
	return 'aeiou'.includes(word[0].toLowerCase()) ? 'an' : 'a';		
}

function generatePaintingName(colour) {
	var number = random(1, 10);
	var day = randomItemFromArray(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
	var time = randomItemFromArray(['Morning', 'Afternoon', 'Night']);
	var person = randomItemFromArray(['Girl', 'Boy', 'Woman', 'Man']);
	var named = randomItemFromArray(['Susanna and', 'Saint George and', 'The Liberty Leading']);
	var jewel = randomItemFromArray(['Earring', 'Necklace', 'Tiara', 'Pendant', 'Medallion', 'Bracelet', 'Brooch', 'Locket']);
	var whimsical = randomItemFromArray(['Birth', 'Garden', 'Tower', 'Oath', 'Persistence', 'Treachery', 'Fall', 'Creation', 'Triumph']);
	var noun = randomItemFromArray(nouns[colour.toLowerCase().replace(' ', '_')]) || 'Kettle';
	var painter = randomItemFromArray(artists);
	var year = random(1500, 1950);
	var pattern = randomItemFromArray([
		'{person} with {an} {noun} {jewel}',
		'The {whimsical} of {noun}',
		'Arrangement in {colour} No. {number}',
		'A {day} {time} with the {noun}',
		'Composition with {colour}',
		'{named} the {noun}',
		'The {colour} House',
	]);
	var an = anOrA(noun);
	
	if (random(0, 100) > 95) {
		pattern = randomItemFromArray([
			'{noun} Descending a Staircase',
			'Saturn Devouring His {noun}'
		]);
	}
	
	pattern = pattern
		.replace('{noun}', noun)
		.replace('{an}', an)
		.replace('{colour}', colour)
		.replace('{number}', number)
		.replace('{jewel}', jewel)
		.replace('{day}', day)
		.replace('{time}', time)
		.replace('{person}', person)
		.replace('{named}', named)
		.replace('{whimsical}', whimsical);
	
	
	return '"' + pattern + '" by ' + painter + ', ' + year;
}