const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight;

window.onresize = function() {
	canvas.width = window.innerWidth / 2;
	canvas.height = window.innerHeight;
}

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

const damageUpMax = 5;
const hpUpMax = 200;
const speedUpMax = 5;
const defenseUpMax = 4;

let frameCount = function _fc(timeStart) {
	let now = performance.now();
	let duration = now - timeStart;

	if(duration < 1000) {  
	    _fc.counter++;
	} else {        
	    _fc.fps = _fc.counter;
	    _fc.counter = 0;
	    timeStart = now; 
	    $('#fpsBox').html(`FPS: <br>${_fc.fps}`);
	}
	requestAnimationFrame(() => frameCount(timeStart)); 
}

frameCount.counter = 0;
frameCount.fps = 0;

frameCount(performance.now());

function setStage() {
	$('#stageBox').html(`Этап: <br>${stage}`);
}

function nextStage() {
	stage++;
	setStage();
	enemySpawn();
	stageStarted = true;
	$('#nextStageMenu').fadeOut(500);
	player.abilities.forEach(ability => ability.act());
	player.x = canvas.width / 2;
	player.y = canvas.height - player.h;
	animate();
}

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

function checkAction(e) {
	if(e.target.id == "next") {
		nextStage();
	}
	if(player.points > 0) {
		if(e.target.parentNode.className == 'upgrades') {
			player.upgrade(e.target.id);
		} else if(e.target.parentNode.className == 'abilities') {
			if(player.points >= e.target.id.match(/\d+/)[0] && !$(`#${e.target.id}`).hasClass('bought')) {
				player.learn(e.target.id.match(/\D+/)[0]);
				player.setPoints(-e.target.id.match(/\d+/)[0]);
				if(e.target.id != 'heal1') 
					$(`#${e.target.id}`).addClass('bought');
			}
		}
	}
}

canvas.addEventListener('mousemove', positionHandler, false);
canvas.addEventListener('touchstart', positionHandler, false);
canvas.addEventListener('touchmove', positionHandler, false); 