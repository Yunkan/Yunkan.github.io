var mainMenuVision = true;
var stageStarted = true;

function closeMainMenu() {
	mainMenuVision = false;
	$('#mainMenu').fadeOut(500);
	enemySpawn();
}

function showNextStageMenu() {
	stageStarted = false;
	$('#nextStageMenu').fadeIn(500).css('display', 'flex');
}

function showEndScreen() {
	stageStarted = false;
	$('#endScreen').fadeIn(500).css('display', 'flex');
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
			player.setPoints(stage % 5 == 0 ? 2 : 1);
			showNextStageMenu();
		}
	}
}

$('#startButton').on('click', animate);
$('#nextStageMenu').on('click', checkAction);
$('#endButton').on('click', () => location.reload());