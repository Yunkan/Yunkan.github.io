const output = document.querySelector('#output');
const goal_input = document.querySelector('#goal');
const btn_start = document.querySelector('#btnStart');

const population_size = 5000;
const alphabet = [
	'1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
	'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ь', 'ы', 'ъ', 'э', 'ю', 'я',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 
	' ', ',', '.', '!', '?', '%', '<', '>', '&', '*', '$', ':', ';', '#', '№', '@', '(', ')', '-', '+', '=', '/', "'", '"'
]

var cycle = 0;
var goal = '';
var population = [];
var new_population = [];
var best = new Individual([]);

/* Individual */
function Individual(gens) {
	this.fitness = 0;
	this.gens = gens;
}

Individual.prototype.calculateFitness = function() {
	this.fitness = 0;
	Array.from(goal).forEach((letter, i) => {
		if(letter === this.gens[i])
			this.fitness++;
	});
}

Individual.prototype.crossing = function(partner) {
	const crossIndex = getRandom(1, this.gens.length - 1);

	var child1 = new Individual([...this.gens.slice(-crossIndex), ...partner.gens.slice(crossIndex)]);
	var child2 = new Individual([...this.gens.slice(crossIndex), ...partner.gens.slice(-crossIndex)]);

	if(getRandom(1, 100) <= 2)
		child1.mutating();
	if(getRandom(1, 100) <= 2)
		child2.mutating();

	new_population.push(child1, child2);
}

Individual.prototype.mutating = function() {
	const mutatedIndex = getRandom(0, this.gens.length - 1);
	this.gens[mutatedIndex] = alphabet[getRandom(0, alphabet.length - 1)];
}

function getRandom(min, max) {
    return ~~(min + Math.random() * (max + 1 - min));
}

/* Main functions */
function fillPopulation() {
	for(let i = 0; i < population_size; i++) {
		const gens = [];
		for(let j = 0; j < goal.length; j++)
			gens.push(alphabet[getRandom(0, alphabet.length - 1)]);
		population.push(new Individual(gens));
	}
}

function selection() {
	population.forEach(individ => {
		individ.calculateFitness();
	});

	population = population.sort((a, b) => {
		if(a.fitness === b.fitness)
			return 0;
		return a.fitness > b.fitness ? -1 : 1;
	});

	best = population[0];
}

function startCrossing() {
	const bests = population.splice(0, population_size / 2);
	for(let i = 0; i < bests.length; i += 2) {
		if(bests[i] && bests[i + 1])
			bests[i].crossing(bests[i + 1]);
	}
	population = new_population;
	population.push(...bests);
	new_population = [];
}

/* Main cycle */
function startAlgorithm() {
	cycle++
	output.innerHTML = `Цикл: ${cycle} <br> Строка: ${best.gens.join('')} <br> Совпадает: ${best.fitness}/${goal.length}`;
	if(best.gens.join('') === goal) {
		return;
	}
	selection();
	startCrossing();

	setTimeout(startAlgorithm, 1);
}

btn_start.addEventListener('click', () => {
	cycle = 0;
	population = [];
	new_population = [];
	best = new Individual([]);
	goal = goal_input.value.toLowerCase();
	fillPopulation();
	startAlgorithm();
});