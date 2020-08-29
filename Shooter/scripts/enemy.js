function Enemy(x, y, w, h, color) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = color;
	this.img = new Image();
	this.img.src = `images/enemy${this.color}.png`;

	this.bullets = [];

	switch(color) {
		case 'Blue':
			this.life = 10;
			this.damage = 10;
			this.moveSpeed = 3;
			this.shootSpeed = 1500;
			break;
		case 'Yellow':
			this.life = 5;
			this.damage = 5;
			this.moveSpeed = 5;
			this.shootSpeed = 1000;
			break;
		case 'Red':
			this.life = 15;
			this.damage = 20;
			this.moveSpeed = 2;
			this.shootSpeed = 2000;
			break;
	}

	this.initPoint();
	this.shoot();
}

Enemy.prototype.draw = function() {
	ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
}

Enemy.prototype.initPoint = function() {
	let endPoint = {
		x: getRandom(enemyWidth, canvas.width - enemyWidth),
		y: getRandom(0, canvas.height - enemyHeight)
	}

	this.dx = endPoint.x - this.x;
	this.dy = endPoint.y - this.y;

	this.line = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

	this.dx = this.moveSpeed * this.dx / this.line;
	this.dy = this.moveSpeed * this.dy / this.line;

	this.dc = this.line;
	this.move();
}

Enemy.prototype.move = function() {
	this.x += this.dx;
	this.y += this.dy;

	this.dc -= Math.sqrt(this.dx * this.dx + this.dy * this.dy);

	if(this.dc >= 0) setTimeout(e => this.move(e), 10);
	else this.initPoint();
}

Enemy.prototype.takeDamage = function(damage, i) {
	this.life -= damage;
	if(this.life <= 0) enemyArray.splice(i, 1);
}

Enemy.prototype.shoot = function() {
	this.bullets.push(new EnemyBullet(this.x + this.w / 2 - 5, this.y + this.h, enemyBulletWidth, enemyBulletHeight, this.color));

	setTimeout(e => this.shoot(e), getRandom(this.shootSpeed - 500, this.shootSpeed + 500));
}

function EnemyBullet(x, y, w, h, color) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.img = new Image();
	this.img.src = `images/bullet${color}.png`;
}

EnemyBullet.prototype.draw = function(enemy, i) {
	ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
	this.move(enemy, i);
}

EnemyBullet.prototype.move = function(enemy, i) {
	this.y += 10;

	if(this.y >= canvas.height) enemy.bullets.splice(i, 1);
}

const enemyArray = [];
const enemyAmount = 4;

function enemySpawn() {
	for(let i = 0; i < enemyAmount + stage; i++) {
		enemyArray.push(new Enemy(
			getRandom(enemyWidth, canvas.width - enemyWidth),
			getRandom(0, enemyHeight),
			enemyWidth, enemyHeight,
			enemyColors[getRandom(0, enemyColors.length - 1)]
		));
	}
}