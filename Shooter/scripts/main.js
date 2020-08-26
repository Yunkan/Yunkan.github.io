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
	    fpsBox.innerHTML = "FPS: <br>" + _fc.fps;
	}
	requestAnimationFrame(() => frameCount(timeStart)); 
}

frameCount.counter = 0;
frameCount.fps = 0;

frameCount(performance.now());

function setStage() {
	stageBox.innerHTML = `Этап: <br>${stage}`;
}

function removePoints() {
	player.setPoints(-1);
}

function nextStage() {
	stage++;
	setStage();
	enemySpawn();
	stageStarted = true;
	nextStageMenu.style.opacity = 0;
	setTimeout(() => nextStageMenu.style.display = 'none', 500);
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
			player.setPoints(-1);
		} else if(e.target.parentNode.className == 'abilities') {
			if(player.points >= e.target.id.match(/\d+/)[0] && !abilitiesBox.querySelector(`#${e.target.id}`).classList.contains('bought')) {
				player.learn(e.target.id.match(/\D+/)[0]);
				player.setPoints(-e.target.id.match(/\d+/)[0]);
				if(e.target.id != 'heal1')abilitiesBox.querySelector(`#${e.target.id}`).classList.add('bought');
			}
		}
		// if(e.target.dataset.dmg && player.damage < dmgUpMax) {
		// 	player.points--;
		// 	player.damage++;
		// 	setPoints();
		// 	nextStageMenu.querySelector('[data-dmg]').innerHTML = `Урон: ${player.damage}/5 +`;
		// } else if(e.target.dataset.hp && player.maxLife < hpUpMax) {
		// 	player.points--;
		// 	player.maxLife += 10;
		// 	player.life += 10;
		// 	setLife(player.life);
		// 	setPoints();
		// 	nextStageMenu.querySelector('[data-hp]').innerHTML = `ОЗ: ${player.maxLife}/200 +`;
		// } else if(e.target.dataset.speed && player.speed < speedUpMax) {
		// 	player.points--;
		// 	player.speed++;
		// 	setPoints();
		// 	nextStageMenu.querySelector('[data-speed]').innerHTML = `Скорость: ${player.speed}/5 +`;
		// } else if(e.target.dataset.def && player.def < defUpMax) {
		// 	player.points--;
		// 	player.def++;
		// 	setPoints();
		// 	nextStageMenu.querySelector('[data-def]').innerHTML = `Броня: ${player.def}/4 +`;
		// } else if(e.target.dataset.regen && player.points >= e.target.dataset.regen) {
		// 	player.points -= e.target.dataset.regen;
		// 	player.abilities.push(new Regeneration());
		// 	setPoints();
		// 	abilitiesBox.querySelector('[data-regen]').classList.add('bought');
		// 	abilitiesBox.querySelector('[data-regen]').dataset.regen = 'bought';
		// } else if(e.target.dataset.pierce && player.points >= e.target.dataset.pierce) {
		// 	player.points -= e.target.dataset.pierce;
		// 	player.abilities.push(new Pierce());
		// 	setPoints();
		// 	abilitiesBox.querySelector('[data-pierce]').classList.add('bought');
		// 	abilitiesBox.querySelector('[data-pierce]').dataset.pierce = 'bought';
		// } else if(e.target.dataset.doubleshot && player.points >= e.target.dataset.doubleshot) {
		// 	player.points -= e.target.dataset.doubleshot;
		// 	player.abilities.push(new DoubleShot());
		// 	setPoints();
		// 	abilitiesBox.querySelector('[data-doubleshot]').classList.add('bought');
		// 	abilitiesBox.querySelector('[data-doubleshot]').dataset.doubleshot = 'bought';
		// } else if(e.target.dataset.heal && player.points >= e.target.dataset.heal) {
		// 	player.points -= e.target.dataset.heal;
		// 	player.life = player.maxLife;
		// 	setPoints();
		// 	player.setLife();
		// }
	}
}

canvas.addEventListener('mousemove', positionHandler, false);
canvas.addEventListener('touchstart', positionHandler, false);
canvas.addEventListener('touchmove', positionHandler, false); 