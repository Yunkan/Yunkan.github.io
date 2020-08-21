const mainMenu = document.getElementById('mainMenu');
const nextStageMenu = document.getElementById('nextStageMenu');
const abilitiesBox = document.getElementById('abilitiesBox');
const startButton = document.getElementById('startButton');
const endScreen = document.getElementById('end');
const endButton = document.getElementById('endButton');

var mainMenuVision = true;
var stageStarted = true;

function removePoints() {
	player.points--;
	setPoints();
}

function checkAction(e) {
	if(e.target.dataset.next) {
		nextStage();
	}
	if(player.points > 0) {
		if(e.target.dataset.dmg && player.damage < dmgUpMax) {
			player.points--;
			player.damage++;
			setPoints();
			nextStageMenu.querySelector('[data-dmg]').innerHTML = `Урон: ${player.damage}/5 +`;
		} else if(e.target.dataset.hp && player.maxLife < hpUpMax) {
			player.points--;
			player.maxLife += 10;
			player.life += 10;
			setLife(player.life);
			setPoints();
			nextStageMenu.querySelector('[data-hp]').innerHTML = `ОЗ: ${player.maxLife}/200 +`;
		} else if(e.target.dataset.speed && player.speed < speedUpMax) {
			player.points--;
			player.speed++;
			setPoints();
			nextStageMenu.querySelector('[data-speed]').innerHTML = `Скорость: ${player.speed}/5 +`;
		} else if(e.target.dataset.def && player.def < defUpMax) {
			player.points--;
			player.def++;
			setPoints();
			nextStageMenu.querySelector('[data-def]').innerHTML = `Броня: ${player.def}/4 +`;
		} else if(e.target.dataset.regen && player.points >= e.target.dataset.regen) {
			player.points -= e.target.dataset.regen;
			player.abilities.push(new Regeneration());
			setPoints();
			abilitiesBox.querySelector('[data-regen]').classList.add('bought');
			abilitiesBox.querySelector('[data-regen]').dataset.regen = 'bought';
		} else if(e.target.dataset.pierce && player.points >= e.target.dataset.pierce) {
			player.points -= e.target.dataset.pierce;
			player.abilities.push(new Pierce());
			setPoints();
			abilitiesBox.querySelector('[data-pierce]').classList.add('bought');
			abilitiesBox.querySelector('[data-pierce]').dataset.pierce = 'bought';
		} else if(e.target.dataset.doubleshot && player.points >= e.target.dataset.doubleshot) {
			player.points -= e.target.dataset.doubleshot;
			player.abilities.push(new DoubleShot());
			setPoints();
			abilitiesBox.querySelector('[data-doubleshot]').classList.add('bought');
			abilitiesBox.querySelector('[data-doubleshot]').dataset.doubleshot = 'bought';
		} else if(e.target.dataset.heal && player.points >= e.target.dataset.heal) {
			player.points -= e.target.dataset.heal;
			player.life = player.maxLife;
			setPoints();
			setLife(player.life);
		}
	}
}

function closeMainMenu() {
	mainMenuVision = false;
	mainMenu.style.opacity = 0;
	setTimeout(() => mainMenu.style.display = 'none', 500);
	enemySpawn();
}

function showNextStageMenu() {
	stageStarted = false;
	nextStageMenu.style.display = 'flex';
	setTimeout(() => nextStageMenu.style.opacity = 1, 500);
}

function showEndScreen() {
	stageStarted = false;
	endScreen.style.display = 'flex';
	setTimeout(() => endScreen.style.opacity = 1, 500);
}

function nextStage() {
	stage++;
	setStage();
	enemySpawn();
	stageStarted = true;
	nextStageMenu.style.opacity = 0;
	setTimeout(() => nextStageMenu.style.display = 'none', 500);
	player.abilities.forEach(ability => ability.act());
	animate();
}

function animate() {
	if(mainMenuVision) {
		closeMainMenu();	
	}

	if(stageStarted) {
		requestAnimationFrame(animate);
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		player.draw();
		bulletArray.forEach((bullet, i) => bullet.draw(i));
		enemyArray.forEach(enemy => {
			enemy.draw();
			enemy.bullets.forEach((bullet, i) => bullet.draw(enemy, i));
		});

		if(enemyArray.length == 0) {
			player.points++;
			setPoints();
			showNextStageMenu();
		}
	}
}

startButton.addEventListener('click', animate);
nextStageMenu.addEventListener('click', checkAction);
endButton.addEventListener('click', () => location.reload());