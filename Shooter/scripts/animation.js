const mainMenu = document.getElementById('mainMenu');
const nextStageMenu = document.getElementById('nextStageMenu');
const abilitiesBox = document.getElementById('abilitiesBox');
const startButton = document.getElementById('startButton');
const endScreen = document.getElementById('end');
const endButton = document.getElementById('endButton');

var mainMenuVision = true;
var stageStarted = true;

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
			player.setPoints(1);
			showNextStageMenu();
		}
	}
}

startButton.addEventListener('click', animate);
nextStageMenu.addEventListener('click', checkAction);
endButton.addEventListener('click', () => location.reload());