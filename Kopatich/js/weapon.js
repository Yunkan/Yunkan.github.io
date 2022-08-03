function Weapon(type) {
	this.currentCooldown = 0;
	this.cooldown = 0;
	this.bulletSpeed = 0;
	this.dmg = 0;
	this.type = type;
	this.angle = 0;
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
				player.bullets.push(new Bullet(
					player.center.x - 5,
					player.center.y - 5,
					mouse.x,
					mouse.y,
					6,
					6));
			}
			break;
		case 'deagle':
			this.currentCooldown = 25;
			this.bulletSpeed = 35;
			this.dmg = 2;
			this.shoot = function() {
				player.bullets.push(new Bullet(
					player.center.x - 5,
					player.center.y - 5,
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
				for(let i = 0; i < 10; i++)
					player.bullets.push(new Bullet(
						player.center.x - 5,
						player.center.y - 5,
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
					player.center.x - 5,
					player.center.y - 5,
					mouse.x + getRandom(-30, 30),
					mouse.y + getRandom(-30, 30)
				));
			}
			break;
		case 'blade':
			this.currentCooldown = 2;
			this.bulletSpeed = 20;
			this.dmg = 2;
			this.bladeSize = 75;
			const bladeDamageArea = areas.find(area => area.name === 'bladeDamageArea');
			if(!bladeDamageArea) {
				const dmg = this.dmg
				areas.push(new Area(
					'bladeDamageArea',
					player.center.x - this.bladeSize,
					player.center.y - this.bladeSize,
					this.bladeSize * 2,
					this.bladeSize * 2,
					function(obj) {
						if(player.shooting && obj.dmgCooldown <= 0) {
							obj.takeDamage(dmg);
							obj.dmgCooldown = 10;
						}
					}
				));
			}
			this.shoot = function() {
				const aoe = areas.find(area => area.name === 'bladeDamageArea');
				aoe.x = player.center.x - this.bladeSize;
				aoe.y = player.center.y - this.bladeSize;
				aoe.w = this.bladeSize * 2;
				aoe.h = this.bladeSize * 2;

				this.angle -= 45;
			}
			break;
	}
}

Weapon.prototype.draw = function() {
	if(this.type === 'blade') {
		if(!player.shooting)
			this.angle = Math.atan2(mouse.y - player.center.y, mouse.x - player.center.x);
	}
	else
		this.angle = Math.atan2(mouse.y - player.center.y, mouse.x - player.center.x);
    ctx.beginPath();
    ctx.save();
    ctx.translate(player.center.x, player.center.y);
    ctx.rotate(this.angle);

    switch(this.type) {
		case 'pistol':		
        	ctx.fillStyle = '#A7A4A4';
			ctx.fillRect(0, 0, 30, 5);
			ctx.strokeStyle = '#353535';
			ctx.lineWidth = 2;
			ctx.moveTo(23, 2.5);
			ctx.lineTo(32, 2.5);
			ctx.stroke();
			break;
		case 'deagle':		
        	ctx.fillStyle = '#A7A4A4';
			ctx.fillRect(0, 0, 35, 6);
			ctx.strokeStyle = '#353535';
			ctx.lineWidth = 3;
			ctx.moveTo(28, 3);
			ctx.lineTo(37, 3);
			ctx.stroke();
			break;
		case 'shotgun':
        	ctx.fillStyle = '#A7A4A4';
			ctx.fillRect(0, 0, 45, 8);
			ctx.strokeStyle = '#353535';
			ctx.lineWidth = 1;
			ctx.moveTo(0, 4);
			ctx.lineTo(45, 4);
			ctx.stroke();
			ctx.fillStyle = '#704206';
			ctx.fillRect(15, -2, 15, 12);
			break;
		case 'automate':
        	ctx.fillStyle = '#A7A4A4';
			ctx.fillRect(0, 0, 50, 6);
			ctx.fillRect(20, -4, 20, 15);
			ctx.strokeStyle = '#353535';
			ctx.lineWidth = 3;
			ctx.moveTo(42, 3);
			ctx.lineTo(48, 3);
			ctx.stroke();
			break;
		case 'blade':
			ctx.beginPath();
        	ctx.fillStyle = '#A7A4A4';
			ctx.moveTo(0, 0);
			ctx.lineTo(this.bladeSize - 20, 0);
			ctx.lineTo(this.bladeSize, 10);
			ctx.lineTo(0, 5);
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
        	ctx.fillStyle = '#DEDEDE';
			ctx.moveTo(0, 3);
			ctx.lineTo(this.bladeSize - 15, 3);
			ctx.lineTo(this.bladeSize - 20, 1);
			ctx.lineTo(0, 1);
			ctx.fill();
			ctx.closePath();
			break;	
	}

    ctx.restore();
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
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.roundRect(0, 0, this.w, this.h, 5).fill();
    ctx.restore();
    ctx.closePath();

    this.move(index);
}

Bullet.prototype.move = function(index) {
    if(this.y >= cnvHeight - this.h || this.y <= -this.h || this.x >= cnvWidth - this.w || this.x <= -this.w) {
        player.bullets.splice(index, 1);
    }

    this.x += this.dx;
    this.y += this.dy;
}

player.boughtWeapons['pistol'] = new Weapon('pistol');
player.getWeapon('pistol');