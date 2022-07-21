function Weapon(type) {
	this.currentCooldown = 0;
	this.cooldown = 0;
	this.bulletSpeed = 0;
	this.dmg = 0;
	this.type = type;
	this.shoot = null;

	this.getType();
}

Weapon.prototype.getType = function() {
	switch(this.type) {
		case 'pistol':
			this.currentCooldown = 20;
			this.bulletSpeed = 30;
			this.dmg = 1;
			this.shoot = function() {
				player.bullets.push(new Bullet(player.x + player.w / 2 - 5, player.y + player.h / 2 - 5, mouse.x, mouse.y));
			}
			break;
		case 'deagle':
			this.currentCooldown = 25;
			this.bulletSpeed = 35;
			this.dmg = 2;
			this.shoot = function() {
				player.bullets.push(new Bullet(
					player.x + player.w / 2 - 5,
					player.y + player.h / 2 - 5,
					mouse.x,
					mouse.y
				));
			}
			break;
		case 'shotgun':
			this.currentCooldown = 50;
			this.bulletSpeed = 30;
			this.dmg = 1;
			this.shoot = function() {
				for(let i = 0; i < 6; i++)
					player.bullets.push(new Bullet(
						player.x + player.w / 2 - 5,
						player.y + player.h / 2 - 5,
						mouse.x + i * getRandom(-10, 10),
						mouse.y + i * getRandom(-10, 10),
						6,
						6
					));
			}
			break;
		case 'automate':
			this.currentCooldown = 10;
			this.bulletSpeed = 40;
			this.dmg = 2;
			this.shoot = function() {
				player.bullets.push(new Bullet(
					player.x + player.w / 2 - 5,
					player.y + player.h / 2 - 5,
					mouse.x + getRandom(-30, 30),
					mouse.y + getRandom(-30, 30)
				));
			}
			break;
	}
}

function Bullet(x, y, endX, endY, w = 8, h = 8) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.angle = Math.atan2(endY - this.y, endX - this.x);
    this.dx = Math.cos(this.angle) * player.weapon.bulletSpeed;
    this.dy = Math.sin(this.angle) * player.weapon.bulletSpeed;
}

Bullet.prototype.draw = function(index) {
	ctx.beginPath();
    ctx.fillStyle = '#ffc900';
    ctx.roundRect(~~this.x, ~~this.y, this.w, this.h, 5).fill();
    ctx.closePath();

    this.move(index);
}

Bullet.prototype.move = function(index) {
    if(this.y >= cnvHeight - this.h || this.y <= -this.h || this.x >= cnvWidth - this.w || this.x <= -this.w) {
        player.bullets.splice(index, 1);
    }

    this.x += ~~this.dx;
    this.y += ~~this.dy;
}

player.boughtWeapons['pistol'] = new Weapon('pistol');
player.getWeapon('pistol');