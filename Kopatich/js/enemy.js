function Enemy(x, y, {w, h, hp, speed, color, dmg}, effect) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.hp = hp;
    this.speed = speed;
    this.color = color;
    this.dmg = dmg;
    this.dmgCooldown = 0;
    this.body = [];
    this.effect = effect;

    this.initLine();
    if(this.effect)
    	this.effect.act(this);
}

Enemy.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    this.body.forEach(part => {
    	ctx.fillStyle = '#AE0101';
    	ctx.fillRect(part.x, part.y, part.w, part.h);
    });
    this.move();
    if(this.effect) {
    	this.effect.draw(this.x, this.y, this.w, this.h);
    }
}

Enemy.prototype.initLine = function() {
    this.endX = player.x;
    this.endY = player.y;

    this.dx = this.endX - this.x;
    this.dy = this.endY - this.y;

    this.line = Math.sqrt(this.dx ** 2 + this.dy ** 2);

    this.dx = this.speed * this.dx / this.line;
    this.dy = this.speed * this.dy / this.line;
}

Enemy.prototype.move = function() {
    this.initLine();

    this.x += this.dx;
    this.y += this.dy;

    this.body.forEach(part => {
    	part.x += this.dx;
    	part.y += this.dy;
    });
	this.dmgCooldown--;

    player.bullets.forEach((bullet, bulletIndex) => {
    	if(checkCollision(bullet, this)) {
    		this.takeDamage(player.weapon.dmg, bullet);
    		player.bullets.splice(bulletIndex, 1);
    	}
    });

    if(player.shooting && checkCollision(this, player.weapon.dmgArea)) {
    	if(this.dmgCooldown <= 0) {
    		this.takeDamage(player.weapon.dmg);
    		this.dmgCooldown = 10;
    	}
    }
}

Enemy.prototype.takeDamage = function(dmg, bullet = { x: this.x - this.w / 2, y: this.y - this.h / 2, dx: getRandom(-40, 40), dy: getRandom(-40, 40) }) {
	if(!(this.effect && this.effect.name === 'armor' && player.weapon.type === 'blade')) {
	    this.hp -= dmg;

	    for(let i = 0; i < dmg * 2; i++) {
	        enemyBlood.push(new Blood(this.x + this.w / 2, this.y + this.h / 2, bullet));
	        this.body.push({
	        	x: getRandom(this.x - this.w / 10, this.x + this.w / 1.2),
	        	y: getRandom(this.y - this.h / 10, this.y + this.h / 1.2),
	        	w: getRandom(this.w / 8, this.w / 4),
	        	h: getRandom(this.h / 8, this.h / 4)
	        });
	    }

	    if(this.hp <= 0) {
	        for(let i = 0; i < 25; i++)
	            explosionParticles.push(new ExplosionParticle(this.x + this.w / 2, this.y + this.h / 2, getRandom(6, 10), getRandom(6, 10), '#AE0101', 8));
	        enemies = enemies.filter(enemy => enemy.hp > 0);
	        player.setScore(getRandom(20, 50));
	    }
	}
    cnv.classList.add('shake');
    setTimeout(() => cnv.classList.remove('shake'), 100);
}

function Blood(x, y, bullet) {
    this.r = getRandom(2, 6);
    this.x = x - this.r / 2;
    this.y = y - this.r / 2;

    this.endX = bullet.x * bullet.dx / 2;
    this.endY = bullet.y * bullet.dy / 2;

    this.dx = (this.endX - this.x) / getRandom(50, 200);
    this.dy = (this.endY - this.y) / getRandom(50, 200);

    this.line = Math.sqrt(this.dx ** 2 + this.dy ** 2);

    this.dx = player.weapon.bulletSpeed * this.dx / this.line;
    this.dy = player.weapon.bulletSpeed * this.dy / this.line;

    this.dc = this.line;
}

Blood.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = '#f00';
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    this.move();
}

Blood.prototype.move = function() {
    if(this.dc >= 0) {
        this.x += this.dx;
        this.y += this.dy;
    }
    this.dc -= Math.sqrt(this.dx ** 2 + this.dy ** 2);
}

const enemySpawn = () => {
    let side = getRandom(0, 3);
    let sideCoordinates = {
        x: 0,
        y: 0
    };

    switch(side) {
        case 0:
            sideCoordinates.x = getRandom(0, cnvWidth);
            sideCoordinates.y = getRandom(-100, -50);
            break;
        case 1:
            sideCoordinates.x = getRandom(cnvWidth, cnvWidth + 100);
            sideCoordinates.y = getRandom(0, cnvHeight);
            break;
        case 2:
            sideCoordinates.x = getRandom(0, cnvWidth);
            sideCoordinates.y = getRandom(cnvHeight, cnvHeight + 100);
            break;
        case 3:
            sideCoordinates.x = getRandom(-100, -50);
            sideCoordinates.y = getRandom(0, cnvHeight);
            break;
    }

    const type = enemyType[getRandom(0, enemyType.length - 1)];
    const effect = getRandom(0, 100) <= 25 ? enemyEffects[getRandom(0, enemyEffects.length - 1)] : null;

    if(!paused)
    	enemies.push(new Enemy(sideCoordinates.x, sideCoordinates.y, {...type}, effect));

    const weaponAmount = Object.keys(player.boughtWeapons).length - 1;
    	setTimeout(enemySpawn, 1500 - 200 * weaponAmount);
}

const bloodRemove = () => {
	if(enemyBlood.length > 0) {
		for(let i = 0; i < 1 + ~~(Math.abs((1000 - enemyBlood.length) / 1000)); i++)
			enemyBlood.splice(0, 1);
	}
	setTimeout(bloodRemove, 1000 - enemyBlood.length);
}

bloodRemove();

// enemies.push(new Enemy(300, 300, {
// 	hp: 500,
// 	speed: 0,
// 	dmg: 2,
// 	w: 35,
// 	h: 35,
// 	color: '#255b0b'
// }));