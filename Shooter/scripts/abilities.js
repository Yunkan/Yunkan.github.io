function Regeneration() {
	this.regen = 1;
}

Regeneration.prototype.act = function() {
	if(player.life != player.maxLife) {
		player.life += this.regen;
		setLife(player.life);
		if(stageStarted) setTimeout(() => this.act(), 1000);
	} else {
		if(stageStarted) setTimeout(() => this.act(), 1000);
	}
}

function Pierce() {
	this.pierce = true;
}

Pierce.prototype.act = function() {
	player.pierce = this.pierce;
}

function DoubleShot() {
	this.doubleShot = true;
}

DoubleShot.prototype.act = function() {
	player.doubleShot = this.doubleShot; 
}