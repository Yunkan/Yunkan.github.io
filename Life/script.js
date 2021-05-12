const cnv = document.getElementById('cnv');
const ctx = cnv.getContext('2d');

cnv.width = 700;
cnv.height = 700;

const cols = document.getElementById('cols');
const rows = document.getElementById('rows');
const size = document.getElementById('size');
const startBtn = document.getElementById('startBtn');
const clearBtn = document.getElementById('clearBtn');
const randomBtn = document.getElementById('randomBtn');

let startLife = false;
let colAmount = 70;
let rowAmount = 70;
let cellSize = 10;

let population = [];
let population2 = [];

const mouse = {
	x: 0,
	y: 0,
	draw: false
}

function getRandom(min, max) {
	return ~~(min + Math.random() * (max + 1 - min));
}

function clearGenerate() {
	population = [];
	for(var i = 0; i < colAmount; i++) {
		population[i] = [];
		for(var j = 0; j < rowAmount; j++) {
			population[i][j] = 0;
		}
	}
}

function randomGenerate() {
	if(!startLife) {
		clearGenerate();
		for(var i = 0; i < colAmount; i++) {
			population[i] = [];
			for(var j = 0; j < rowAmount; j++) {
				population[i][j] = getRandom(0, 1);
			}
		}
	}
}

function drawField() {
	cnv.width = colAmount * cellSize;
	cnv.height = rowAmount * cellSize;
	ctx.fillStyle = '#ddd';
	ctx.fillRect(0, 0, cnv.width, cnv.height);
	for(var x = 0; x < colAmount; x++) {
		for(var y = 0; y < rowAmount; y++) {
			drawCell(x, y);
		}
	}
}

function drawCell(i, j) {
	if(population[i][j] == 1) {
		ctx.fillStyle = '#000';	
		ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
	} else {
		ctx.fillStyle = '#ddd';	
		ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
		ctx.strokeStyle = '#aaa';
		ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
	}
}

function step() {
	population2 = [];
	for(let i = 0; i < population.length; i++) {
		population2[i] = [];
		for(let j = 0; j < population[i].length; j++) {
			let neighbors = 0;

			if(population[fpm(i, 'col') - 1][j] == 1) neighbors++;
			if(population[i][fpp(j, 'row') + 1] == 1) neighbors++;
			if(population[fpp(i, 'col') + 1][j] == 1) neighbors++;
			if(population[i][fpm(j, 'row') - 1] == 1) neighbors++;
			if(population[fpm(i, 'col') - 1][fpp(j, 'row') + 1] == 1) neighbors++;
			if(population[fpp(i, 'col') + 1][fpp(j, 'row') + 1] == 1) neighbors++;
			if(population[fpp(i, 'col') + 1][fpm(j, 'row') - 1] == 1) neighbors++;
			if(population[fpm(i, 'col') - 1][fpm(j, 'row') - 1] == 1) neighbors++;

			if(population[i][j] == 0 && neighbors == 3) population2[i][j] = 1;
			(population[i][j] == 1 && neighbors == 2 || neighbors == 3) ? population2[i][j] = 1 : population2[i][j] = 0;
		}
	}
	population = population2;
}

function fpm(i, line) {
	let num = 0;
	if(line === 'col')
		num = colAmount;
	else
		num = rowAmount;

	if(i === 0) return num;
	else return i;
}

function fpp(i, line) {
	let num = 0;
	if(line === 'col')
		num = colAmount;
	else
		num = rowAmount;

	if(i === num - 1) return -1;
	else return i;
}

function animate() {
	if(startLife) {
		ctx.clearRect(0, 0, cnv.width, cnv.height);

		drawField();
		step();

		requestAnimationFrame(animate);
	}
}

cols.addEventListener('change', () => {
	document.getElementById('colValue').innerHTML = cols.value;
	colAmount = +cols.value;
	clearGenerate();
	drawField();
});

rows.addEventListener('change', () => {
	document.getElementById('rowValue').innerHTML = rows.value;
	rowAmount = +rows.value;
	clearGenerate();
	drawField();
});

size.addEventListener('change', () => {
	document.getElementById('sizeValue').innerHTML = size.value;
	cellSize = +size.value;
	clearGenerate();
	drawField();
});

startBtn.addEventListener('click', () => {
	if(startBtn.innerHTML === 'Старт') {
		startBtn.innerHTML = 'Стоп';
		startLife = true;
		cols.disabled = true;
		rows.disabled = true;
		size.disabled = true;
		clearBtn.disabled = true;
		randomBtn.disabled = true;
		animate();
	} else {
		startBtn.innerHTML = 'Старт';
		startLife = false;
		cols.disabled = false;
		rows.disabled = false;
		size.disabled = false;
		clearBtn.disabled = false;
		randomBtn.disabled = false;
	}
});

clearBtn.addEventListener('click', () => {
	clearGenerate();
	drawField();
});

randomBtn.addEventListener('click', () => {
	randomGenerate();
	drawField();
});

function cellPrimaryInteract(e) {
	if(!startLife) {
		if(e.which == 1) {
			mouse.draw = true;
			population[mouse.x][mouse.y] = 1;
			drawCell(mouse.x, mouse.y);
		} else if(e.which == 3) {
			mouse.clear = true;			
			population[mouse.x][mouse.y] = 0;
			drawCell(mouse.x, mouse.y);
		}
	}
}

cnv.addEventListener('mousedown', cellPrimaryInteract);
cnv.addEventListener('contextmenu', (e) => e.preventDefault());

cnv.addEventListener('mouseup', (e) => {
	mouse.draw = false;
	mouse.clear = false;
});

cnv.addEventListener('mousemove', (e) => {
	mouse.x = ~~(e.offsetX / cellSize);
	mouse.y = ~~(e.offsetY / cellSize);
	for(let i = 0; i < population.length; i++) {
		for(let j = 0; j < population[i].length; j++) {
			if(i == mouse.x && j == mouse.y && !startLife) {
				if(mouse.draw) {
					population[i][j] = 1;
					drawCell(i, j);
				} else if(mouse.clear) {
					population[i][j] = 0;
					drawCell(i, j);
				}
			}
		}
	}
});

clearGenerate();
drawField();