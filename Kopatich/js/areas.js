function Area(name, x, y, w, h, effect) {
	this.name = name;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.effect = effect;
}

Area.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
}