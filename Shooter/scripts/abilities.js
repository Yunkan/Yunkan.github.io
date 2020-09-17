function Regeneration() {
	this.regen = 1;
}

Regeneration.prototype.act = function() {
	if(player.life != player.maxLife) {
		player.setLife(this.regen);
	}
	if(stageStarted) setTimeout(() => this.act(), 1000);
}

function DoubleShot() {
	this.doubleShot = true;
}

DoubleShot.prototype.act = function() {
	player.doubleShot = this.doubleShot; 
}

function Explosion() {
	this.explosion = true;
}

Explosion.prototype.act = function() {
	for(var i = 0; i < 4; i++) {
		const bullet = new Bullet(
			player.x + player.w / 2, player.y + player.h / 2,
			bulletWidth, bulletHeight,
			i < 2 ? -5 : 5, (i == 0 || i == 3) ? -5 : 5,
			(-45 + 90 * i) * Math.PI / 180);
		bulletArray.push(bullet);
	}

	if(stageStarted) setTimeout(() => this.act(), 2000);
}