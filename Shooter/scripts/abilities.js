function regeneration() {
	if(player.life != player.maxLife) {
		player.setLife(1);
	}
	if(stageStarted) setTimeout(regeneration, 1000);
}

function doubleShot() {
	player.doubleShot = true; 
}

function explosion() {
	for(var i = 0; i < 4; i++) {
		bulletArray.push(new Bullet(
			player.x + player.w / 2, player.y + player.h / 2,
			bulletWidth, bulletHeight,
			i < 2 ? -5 : 5, (i == 0 || i == 3) ? -5 : 5,
			(-45 + 90 * i) * Math.PI / 180
		));
	}

	if(stageStarted) setTimeout(explosion, 2000);
}