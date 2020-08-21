function Player(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.maxLife = 100;
	this.life = 100;
	this.damage = 1;
	this.speed = 1;
	this.def = 0;
	this.abilities = [];
	this.points = 0;
	this.pierce = false;
	this.doubleShot = false;
	this.img = new Image();
	this.img.src = "images/player.png";
}

Player.prototype.draw = function() {
	ctx.drawImage(this.img, this.x, this.y, this.w, this.h);

	if(enemyArray) {
		enemyArray.forEach((enemy, i) => {
			if(checkCollision(this, enemy)) {
				this.takeDamage(enemy.damage);
				enemyArray.splice(i, 1);
			}

			enemy.bullets.forEach((bullet, i) => {
				if(checkCollision(this, bullet)) {
					this.takeDamage(enemy.damage);
					enemy.bullets.splice(i, 1);
				}
			})
		});
	}
}

Player.prototype.move = function() {
	if(canvas.width > this.x - this.w && this.x + this.w >= 0) {
		this.x = mouse.x - this.w / 2;
	}

	if(canvas.height > this.y - this.h && this.y + this.h >= 0){
		this.y = mouse.y - this.h / 2;
	}
}

Player.prototype.takeDamage = function (damage) {
	this.life -= damage - this.def;
	setLife(this.life);
	if(this.life <= 0) showEndScreen();
}

const player = new Player(canvas.width / 2 - playerWidth, canvas.height - playerHeight, playerWidth, playerHeight);

function Bullet(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.dy = 10;
	this.life = 100;
	this.img = new Image();
	this.img.src = "images/bullet.png";
}

Bullet.prototype.draw = function(i) {
	ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
	this.y -= this.dy;

	if(this.y + this.h <= 0) {
		bulletArray.splice(i, 1);
	}

	if(enemyArray) {
		enemyArray.forEach((enemy, enemyIndex) => {
			if(checkCollision(this, enemy)) {
				if(!player.pierce) bulletArray.splice(i, 1);
				enemy.takeDamage(player.damage, enemyIndex);
			}
		});
	}
}

const bulletArray = [];

const bulletSpawn = setInterval(() => {
	if(player.doubleShot) {
		bulletArray.push(new Bullet(player.x + player.w / 4 - bulletWidth / 2, player.y, bulletWidth, bulletHeight));
		bulletArray.push(new Bullet(player.x + player.w - bulletWidth, player.y, bulletWidth, bulletHeight));
	} else 
		bulletArray.push(new Bullet(player.x + player.w / 2 - bulletWidth / 2, player.y, bulletWidth, bulletHeight));
}, 200 - player.speed * 20);