const cnv = document.getElementById('cnv');
const ctx = cnv.getContext('2d');

cnv.width = window.innerWidth;
cnv.height = window.innerHeight / 1.25;

function getRandom(min, max) {
	return ~~(min + Math.random() * (max + 1 - min));
}

/* Cell Size */
const selectSize = document.getElementById('selectSize');
const randomSize = document.getElementById('randomSize');
const cellSize = document.getElementById('cellSize');

var size;

selectSize.addEventListener('change', () => {
	cellSize.disabled = false;
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	size = +cellSize.value;
	new Cell(cnv.width / 2, cnv.height / 2, size).draw();
});
randomSize.addEventListener('change', () => {
	cellSize.disabled = true;
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	size = getRandom(2, 20);
});

cellSize.addEventListener('input', () => {
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	size = +cellSize.value;
	new Cell(cnv.width / 2, cnv.height / 2, size).draw();
});

/* Start Aiming */
var start = false;
var score = 0;
const cells = [];
const btnStart = document.getElementById('btnStart');
const scoreBox = document.getElementById('scoreBox');

function startAiming() {
	if(start) {
		const $size = size ? size : getRandom(2, 20);
		cells.push(new Cell(getRandom($size, cnv.width - $size), getRandom($size, cnv.height - $size), $size));
		setTimeout(startAiming, getRandom(200, 1000));
	}
}

function animate() {
	if(start) {
		ctx.clearRect(0, 0, cnv.width, cnv.height);

		cells.forEach(cell => cell.draw());
		requestAnimationFrame(animate);
	}
}

btnStart.addEventListener('click', () => {
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	cells.length = 0;
	document.querySelector('.controls').classList.toggle('hide');
	start = !start;
	if(btnStart.innerHTML == 'Начать') {
		score = 0;
		scoreBox.innerHTML = `Очков: ${score}`;
		btnStart.innerHTML = 'Стоп';
		animate();
		startAiming();
	} else {
		btnStart.innerHTML = 'Начать';
	}
});

cnv.addEventListener('click', e => {
	const x = e.offsetX;
	const y = e.offsetY;

	cells.forEach((cell, i) => {
		if(x <= cell.x + cell.r && x + cell.r >= cell.x &&
		   y <= cell.y + cell.r && y + cell.r >= cell.y) {
			cells.splice(i, 1);
			score++;
			scoreBox.innerHTML = `Очков: ${score}`;
		}
	});
});