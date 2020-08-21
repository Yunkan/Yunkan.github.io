const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight;

window.onresize = function() {
	canvas.width = window.innerWidth / 2;
	canvas.height = window.innerHeight;
}

const stageBox = document.getElementById("stageBox");
const lifeBox = document.getElementById("lifeBox");
const fpsBox = document.getElementById("fpsBox");
const pointsBox = document.getElementById("pointsBox");
const mouse = {
	x: 0,
	y: 0,
};

var stage = 1;

const playerWidth = window.matchMedia("(max-width: 400px)").matches ? 22 : 30;
const playerHeight = window.matchMedia("(max-width: 400px)").matches ? 37 : 50;
const bulletWidth = window.matchMedia("(max-width: 400px)").matches ? 7 : 10;
const bulletHeight = window.matchMedia("(max-width: 400px)").matches ? 15 : 20;
const enemyWidth = window.matchMedia("(max-width: 400px)").matches ? 30 : 40;
const enemyHeight = window.matchMedia("(max-width: 400px)").matches ? 30 : 40;
const enemyBulletWidth = window.matchMedia("(max-width: 400px)").matches ? 7 : 10;
const enemyBulletHeight = window.matchMedia("(max-width: 400px)").matches ? 15 : 20;
const enemyColors = ['Blue', 'Yellow', 'Red'];

const dmgUpMax = 5;
const hpUpMax = 200;
const speedUpMax = 5;
const defUpMax = 4;

let frameCount = function _fc(timeStart) {
	let now = performance.now();
	let duration = now - timeStart;

	if(duration < 1000) {  
	    _fc.counter++;
	} else {        
	    _fc.fps = _fc.counter;
	    _fc.counter = 0;
	    timeStart = now; 
	    fpsBox.innerHTML = "FPS: <br>" + _fc.fps;
	}
	requestAnimationFrame(() => frameCount(timeStart)); 
}

frameCount.counter = 0;
frameCount.fps = 0;

frameCount(performance.now());

function setLife(life) {
	lifeBox.innerHTML = `ОЗ: <br>${life}`;
}

function setStage() {
	stageBox.innerHTML = `Этап: <br>${stage}`;
}

function setPoints() {
	pointsBox.innerHTML = `Очков: ${player.points}`;
}

setLife(100);
setStage();

function getRandom(min, max) {
	return Math.floor(min + Math.random() * (max + 1 - min));
}

function checkCollision(obj1, obj2) {
	if(obj1 && obj2) {
		if((obj1.x + obj1.w >= obj2.x) && (obj1.x <= obj2.x + obj2.w) &&
			(obj1.y + obj1.h >= obj2.y) && (obj1.y <= obj2.y + obj2.h)) {
			return true;
		} else {
			return false;
		}
	}
}

function positionHandler(e) {
	if(e.offsetX && e.clientY) {
		mouse.x = e.offsetX;
		mouse.y = e.clientY;
		player.move();
	} else if(e.targetTouches) {
		mouse.x = e.targetTouches[0].clientX - canvas.offsetLeft / 2;
		mouse.y = e.targetTouches[0].clientY;
		e.preventDefault();
		player.move();
	}
}

canvas.addEventListener('mousemove', positionHandler, false);
canvas.addEventListener('touchstart', positionHandler, false);
canvas.addEventListener('touchmove', positionHandler, false); 