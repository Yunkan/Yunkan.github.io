function Player(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.maxLife = 100;
	this.life = 100;
	this.damage = 1;
	this.speed = 1;
	this.defense = 0;
	this.abilities = [];
	this.points = 0;
	this.doubleShot = false;
	this.img = new Image();
	this.img.src = "images/player.png";
}

Player.prototype.draw = function() {
	ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
	if(enemyArray) {
		enemyArray.forEach((enemy, i) => {
			if(checkCollision(this, enemy)) {
				this.takeDamage(-enemy.damage);
				if(!enemy.boss) enemyArray.splice(i, 1);
			}

			enemy.bullets.forEach((bullet, i) => {
				if(checkCollision(this, bullet)) {
					this.takeDamage(-enemy.damage);
					enemy.bullets.splice(i, 1);
				}
			})
		});
	}
}

Player.prototype.move = function() {
	if(canvas.width > this.x - this.w && this.x + this.w >= 0) {
		this.x = mouse.x - this.w;
	}

	if(canvas.height > this.y - this.h && this.y + this.h >= 0){
		this.y = mouse.y - this.h;
	}
}

Player.prototype.takeDamage = function (damage) {
	this.setLife(damage + this.defense);
	if(this.life <= 0) showEndScreen();
}

Player.prototype.setLife = function(life) {
	if(life) this.life += life;
	$('#lifeBox').html(`ОЗ: <br>${this.life}`);
}

Player.prototype.setPoints = function(points) {
	if(points) this.points += points;
	$('#pointsBox').html(`Очков: ${this.points}`);
}

Player.prototype.upgrade = function(up) {
	switch(up) {
		case 'damage':
			if(this.damage < damageUpMax) {
				this.damage++;
				player.setPoints(-1);
				$(`#nextStageMenu #${up}`).html(`Урон: ${this.damage}/5 +`);
			}
			break;
		case 'hp':
			if(this.maxLife < hpUpMax) {
				this.maxLife += 10;
				this.setLife(10);
				player.setPoints(-1);
				$(`#nextStageMenu #${up}`).html(`ОЗ: ${this.maxLife}/200 +`);
			}
			break;
		case 'speed':
			if(this.speed < speedUpMax) {
				this.speed++;
				player.setPoints(-1);
				$(`#nextStageMenu #${up}`).html(`Скорость: ${this.speed}/5 +`);
			}
			break;
		case 'defense':
			if(this.defense < defenseUpMax) {
				this.defense++;
				player.setPoints(-1);
				$(`#nextStageMenu #${up}`).html(`Броня: ${this.defense}/4 +`);
			}
			break;
	}
}

Player.prototype.learn = function(ability) {
	switch(ability) {
		case 'heal':
			this.life = this.maxLife;
			this.setLife();
			break;
		case 'regen':
			this.abilities.push(regeneration);
			break;
		case 'doubleShot':
			this.abilities.push(doubleShot);
			break;
		case 'explosion':
			this.abilities.push(explosion);
			break;
	}
}

const player = new Player(canvas.width / 2 - playerWidth, canvas.height - playerHeight, playerWidth, playerHeight);

function Bullet(x, y, w, h, dy = -10, dx = 0, rotate = 0) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.dy = dy;
	this.dx = dx;
	this.rotate = rotate;
	this.img = new Image();
	this.img.src = "images/bullet.png";
}

Bullet.prototype.draw = function(i) {
	ctx.save();
	ctx.translate(this.x + this.w / 2, this.y);
	ctx.rotate(this.rotate);
	ctx.drawImage(this.img, -this.w / 2, -this.h / 2, this.w, this.h);
	ctx.restore();
	this.move(i);
}

Bullet.prototype.move = function(i) {
	this.y += this.dy;
	this.x += this.dx;

	if(this.y + this.h <= 0 || this.y >= canvas.height || this.x + this.w <= 0 || this.x >= canvas.width) {
		bulletArray.splice(i, 1);
	}

	if(enemyArray) {
		enemyArray.forEach((enemy, enemyIndex) => {
			if(checkCollision(this, enemy)) {
				bulletArray.splice(i, 1);
				enemy.takeDamage(player.damage, enemyIndex);
			}
		});
	}
}

const bulletArray = [];

const bulletSpawn = setInterval(() => {
	if(stageStarted) {
		if(player.doubleShot) {
			bulletArray.push(new Bullet(player.x + player.w / 4 - bulletWidth / 2, player.y, bulletWidth, bulletHeight));
			bulletArray.push(new Bullet(player.x + player.w - bulletWidth, player.y, bulletWidth, bulletHeight));
		} else 
			bulletArray.push(new Bullet(player.x + player.w / 2 - bulletWidth / 2, player.y, bulletWidth, bulletHeight));
	}
}, 200 - player.speed * 20);