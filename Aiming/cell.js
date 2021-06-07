function Cell(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;
}

Cell.prototype.draw = function() {
	ctx.beginPath();
	ctx.fillStyle = '#01034B';
	ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
	ctx.fill();
}