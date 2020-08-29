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